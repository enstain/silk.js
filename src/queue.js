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
	}

	add(entity) {
		console.log('add to queue', entity);
		this.barn.lpush('waitList', entity.uuid);
		this.barn.set(entity.uuid, entity.serialize());
	}

	execute() {
		this.inspectLengthOfLists();
		this.inspectProgressList();
		this.inspectRecoverList();
		this.reviseWaitList();
	}

	inspectLengthOfLists() {
		console.log('length progress list ', this.barn.llen('progressList'));
		console.log('length recover list ', this.barn.llen('recoverList'));
		console.log('length wait list ', this.barn.llen('waitList'));
	}

	inspectProgressList() {
		while (this.barn.llen('progressList') > 0) {
			let uuid = this.barn.lpop('progressList');
			console.log('move entity to recover list', uuid);
			this.barn.lpush('recoverList', uuid);
			this.barn.condense();
		}
	}

	inspectRecoverList() {
		while (this.barn.llen('recoverList') > 0) {
			let uuid = this.barn.lpop('recoverList');
			console.log('entity to recover', uuid);
			if (this.entityIsSaved(uuid)) {
				this.removeSavedEntity(uuid);
			} else {
				this.barn.lpush('waitList');
			}
			this.barn.condense();
		}
	}

	reviseWaitList() {
		console.log('length progress list ', this.barn.llen('progressList'));
		while (this.barn.llen('waitList') > 0) {
			let uuid = this.barn.lpop('waitList');
			this.barn.lpush('progressList', uuid);
			console.log('length progress list ', this.barn.llen('progressList'));
			this.barn.condense();
			let unsaved_entity = this.barn.get(uuid);
			let saveEntity = promisify(API.create);
			saveEntity(unsaved_entity).then(() => this.removeSavedEntity(uuid));
		}
	}

	removeSavedEntity(uuid) {
		console.log('remove saved entity ', uuid);
		this.barn.del(uuid);
	}

	entityIsSaved(uuid) {
		return this.barn.get(uuid) === null;
	}


}

export var queue = typeof window == "undefined" ? null : new Queue();
