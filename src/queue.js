"use strict";

import Barn from "../node_modules/barn/index.js"
import API from "./api"

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

		setInterval(() =>
			this.execute(), 1000
		);
	}

	add(entity) {
		this.barn.lpush('waitList', entity.uuid);
		this.barn.set(entity.uuid, entity);
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
			if (DEBUG) {
				console.log('inspect recover', uuid);	
			}
			if (this.entityDataIsNotEmpty(uuid)) {
				let checkStatus = new Promise( (resolve, reject) => this.api.show(uuid, resolve(status)) );
				checkStatus.then((status) => this.processEntityInRecover(uuid, status.saved));
			}
			this.barn.condense();
		}
	}

	processEntityInRecover(uuid, saved) {
		if (saved) {
			this.removeSavedEntity(uuid);
		} else {
			this.barn.lpush('waitList', uuid);
		}
	}

	entityDataIsNotEmpty(uuid) {
		return this.barn.get(uuid) != null
	}

	reviseWaitList() {
		while (this.barn.llen('waitList') > 0) {
			let uuid = this.barn.lpop('waitList');
			this.barn.lpush('progressList', uuid);
			this.barn.condense();
			let unsaved_entity = this.barn.get(uuid);
			if (DEBUG) {
				console.log('request for create unsaved entity', unsaved_entity);	
			}
			let saveEntity = new Promise( (resolve, reject) => this.api.create(unsaved_entity, resolve()) );
			saveEntity.then(() => this.removeSavedEntity(uuid))
		}
	}

	removeSavedEntity(uuid) {
		if (DEBUG) {
			console.log('remove saved entity', uuid);
		}
		this.barn.del(uuid);
	}


}

export var queue = typeof window == "undefined" ? null : new Queue(localStorage, new API(config.token));
