function LocalStorage() {
	this.writeObject=function(name,obj) {return writeObject(name,obj);};
	this.readObject=function(name) {return readObject(name);};

	function writeObject(name,obj) {
		try {
			localStorage[name]=JSON.stringify(obj);
			return true;
		}
		catch(err) {
			return false;
		}
	}
	function readObject(name) {
		var obj;
		try {
			var json=localStorage[name]||'{}';
			obj=JSON.parse(json);
			return obj;
		}
		catch(err) {
			return {};
		}
	}
}