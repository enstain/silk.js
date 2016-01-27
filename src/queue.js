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
	constructor(storage) {
		this.barn = new Barn(storage || localStorage); 
		this.execute();
	}

	add(entity) {
		this.barn.lpush('waitList', entity.uuid);
		this.barn.set(entity.uuid, entity);
	}

	execute() {
		return new Promise((resolve, reject) => {
			this.inspectProgressList();
			this.inspectRecoverList();//.then(() => *recover list use async request, need to make promise
			this.reviseWaitList().then(() => resolve('execution done'));
	    })
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
		return this.barn.get(uuid) === null && API.show(uuid);
	}

	reviseWaitList() {
		let promises = [];

		while (this.barn.llen('waitList') > 0) {
			let uuid = this.barn.lpop('waitList');
			this.barn.lpush('progressList', uuid);
			this.barn.condense();
			let unsaved_entity = this.barn.get(uuid);
			
			let saveEntity = promisify(API.create);
			promises.push(
				saveEntity(unsaved_entity).then(() => this.removeSavedEntity(uuid))
			);
		}

		return Promise.all(promises);
	}

	removeSavedEntity(uuid) {
		console.log('remove saved entity', uuid);
		this.barn.del(uuid);
	}


}

export var queue = typeof window == "undefined" ? null : new Queue();
