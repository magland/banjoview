function BanjoLog(O) {
	O=O||this;
	JSQObject(O);

	this.message=function(category,text) {message(category,text);};

	var m_messages=[];

	function message(category,text) {
		var msg={category:category,text:text};
		O.emit('new_message',{message:JSQ.clone(msg)});
		m_messages.push(msg);
	}
}