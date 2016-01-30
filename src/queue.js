"use strict";

import Barn from "../node_modules/barn/index.js"
import API from "./api"
var promisify = require("es6-promisify")

/***********************************************

Queue lists

1. waitList keeps new unsaved entities
2. progressList keeps entities requested to save at the server
3. recoverList keeps items of progressList, which didn't get callback from server because of interrupt

***********************************************/

export class Queue {
	constructor(storage, api) {
		this.barn = new Barn(storage);
		this.api = api;
		setTimeout(() =>
			this.execute(), 10
		);
	}

	add(entity) {
		this.barn.lpush('waitList', entity.uuid);
		this.barn.set(entity.uuid, entity);
		setTimeout(() =>
			this.execute(), 10
		);
	}

	execute() {
		this.inspectProgressList();
		this.inspectRecoverList();
		this.reviseWaitList();
	}

	inspectProgressList() {
		while (this.barn.llen('progressList') > 0) {
			let uuid = this.barn.lpop('progressList');
			this.barn.lpush('recoverList', uuid);
			this.barn.condense();
		}
	}

	inspectRecoverList() {
		while (this.barn.llen('recoverList') > 0) {
			let uuid = this.barn.lpop('recoverList');
			if (this.entityIsSaved(uuid)) {
				this.removeSavedEntity(uuid);
			} else {
				this.barn.lpush('waitList', uuid);
			}
			this.barn.condense();
		}
	}

	entityIsSaved(uuid) {
		return this.barn.get(uuid) === null && this.api.show(uuid);
	}

	reviseWaitList() {
		while (this.barn.llen('waitList') > 0) {
			let uuid = this.barn.lpop('waitList');
			this.barn.lpush('progressList', uuid);
			this.barn.condense();
			let unsaved_entity = this.barn.get(uuid);
			let saveEntity = promisify(this.api.create);
			saveEntity(unsaved_entity).then(() => this.removeSavedEntity(uuid))
		}
	}

	removeSavedEntity(uuid) {
		console.log('remove saved entity', uuid);
		this.barn.del(uuid);
	}


}

export var queue = typeof window == "undefined" ? null : new Queue(localStorage, API);
