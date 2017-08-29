function BanjoLogWidget(O,banjo_log) {
	O=O||this;
	JSQWidget(O);

	JSQ.connect(banjo_log,'new_message',O,function(sender,args) {handle_new_message(args.message);});

	function handle_new_message(msg) {
		O.div().append(msg.category+': '+msg.text);
		O.div().append('<br/>');
	}
}