import './utils/mocking_setup';
import {Queue} from '../src/queue'
var promisify = require("es6-promisify")

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

describe('Queue.add', () => {
  var storage,
      queue,
      entity;

  beforeEach(function(){
    storage = createMockStorage();
    queue = new Queue(storage);
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

describe('Queue.execute', () => {
  var storage,
      queue,
      entity,
      execution;

  beforeEach(function(done){
    storage = createMockStorage();
    queue = new Queue(storage);
    entity = {
      uuid: Math.random(),
      serialize: function() {
        return true
      }
    }
    queue.add(entity);
    
    queue.execute().then(function() {
      done();
    });
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

  
});