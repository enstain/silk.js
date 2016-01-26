import {Queue} from '../src/queue'

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
  });

  it('add entity should raise count of items in waiting list', () => {
    queue.add(entity);
    expect(queue.barn.llen('waitList')).toBe(1);
  });
});