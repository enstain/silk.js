//import './utils/mocking_setup';
import {Queue} from '../src/queue'
import MockAPI from './utils/modules/mockAPI.js'
import MockFailureAPI from './utils/modules/mockFailureAPI.js'

function createMockStorage(){
  return {
    s:{},
    length: 0,
    getItem: function(key){
      return (key in this.s) ? this.s[key] : null;
    },
    setItem: function(key, val){
      if(!(key in this.s)) this.length++;
      this.s[key] = ''+val;
    },
    removeItem: function(key){
      if(key in this.s) this.length--;
      delete this.s[key];
    },
    key: function(idx){
      return Object.keys(this.s)[idx] || null;
    },
    clear: function(){
      this.length = 0;
      var _this = this;
      Object.keys(this.s).forEach(function(key){
        _this.removeItem(key);
      });
    }
  };
}

describe('Queue', () => {

  //Queue add
  describe('add', () => {
    var storage,
        queue,
        entity;

    beforeEach(function(){
      storage = createMockStorage();
      queue = new Queue(storage, MockAPI);
      entity = {
        uuid: "1",
        getFetchedObjectForQueue: function() {
          return true
        }
      }
      queue.add(entity);
    });

    it('should raise count of items in waiting list', () => {
      expect(queue.barn.llen('waitList')).toBe(1);
    });

    it('should save data of item in localStorage', () => {
      expect(queue.barn.get(entity.uuid)).toBe(entity);
    });
  });

  //Queue constructor
  describe('constructor', () => {
    var storage,
        api,
        queue,
        entity;

    beforeEach(function(){
      storage = createMockStorage();
      entity = {
        uuid: Math.random(),
        serialize: function() {
          return true
        }
      }
    });

    //Queue constructor with good API
    describe('with good API', () => {

      beforeEach(function(){
        api = MockAPI;
        queue = new Queue(storage, api);
        queue.add(entity);
      });

      describe('and stable work', () => {
        beforeEach(function(done) {
          setTimeout(function() {
            done()
          }, 200);
        });

        it('should raise count of items in progressList', () => {
          expect(queue.barn.llen('progressList')).toBe(1);
        });

        it('should erase items in waitList', () => {
          expect(queue.barn.llen('waitList')).toBe(0);
        });

        it('should erase data of success saved item', () => {
          expect(queue.barn.get(entity.uuid)).toBe(null);  
        });

        it('should meet empty lists and storage on the new execute of queue', (done) => {
          let another_queue = new Queue(storage, api);
          setTimeout(function() {
            expect(another_queue.barn.llen('progressList')).toBe(0);
            expect(another_queue.barn.llen('recoverList')).toBe(0);
            expect(another_queue.barn.llen('waitList')).toBe(0);
            expect(another_queue.barn.get(entity.uuid)).toBe(null);  
            done()
          }, 1000);
        });

        it('should meet unprocessing but saved items before new execute of queue', () => {
          let another_queue = new Queue(storage, api);
          expect(another_queue.barn.llen('progressList')).toBe(1);
          expect(queue.barn.get(entity.uuid)).toBe(null); 
        });
      });

    });

    //Queue constructor with failure API
    describe('with failure API', () => {

      beforeEach(function(done){
        api = MockFailureAPI;
        queue = new Queue(storage, api);
        queue.add(entity);
        setTimeout(function() {
          done()
        }, 200);
      });

      it('should raise count of items in progressList', () => {
        expect(queue.barn.llen('progressList')).toBe(1);
      });

      it('should erase items in waitList', () => {
        expect(queue.barn.llen('waitList')).toBe(0);
      });

      it('shouldn`t erase data of item in storage', () => {
        expect(queue.barn.get(entity.uuid)).toBe(entity);
      });

      it('shouldn`t meet empty lists and storage on the new execute of queue', (done) => {
        let another_queue = new Queue(storage, api);
        setTimeout(function() {
          expect(another_queue.barn.llen('progressList')).toBe(1);
          expect(another_queue.barn.llen('recoverList')).toBe(0);
          expect(another_queue.barn.llen('waitList')).toBe(0);
          expect(another_queue.barn.get(entity.uuid)).not.toBe(null);
          done()
        }, 1000);
      });

      it('should meet unprocessing and unsaved items before new execute of queue', () => {
        let another_queue = new Queue(storage, api);
        expect(another_queue.barn.llen('progressList')).toBe(1);
        expect(queue.barn.get(entity.uuid)).toBe(entity);
      });

    });

  });
});