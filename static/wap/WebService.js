function WebService(postParams,postParamUrl){
	this.postParams = null||postParams;
	this.postParamUrl = ""||postParamUrl;
	this.submitUrl = "";
	this.showHidder = $.noop;
	this.hideHidder = $.noop;
	this.checkParams = function(data){return true;};
	this.showErr = function(msg){alert(msg);};
	this.showLoading = $.noop;
	this.hideLoading = $.noop;
}
WebService.prototype.setShowHidder = function(showHidderHandler){
	this.showHidder = showHidderHandler;
	return this;
}
WebService.prototype.setHideHidder = function(hideHidderHandler){
	this.hideHidder = hideHidderHandler;
	return this;
}
WebService.prototype.setCheckParams = function(checkParamsHandler){
	this.checkParams = checkParamsHandler;
	return this;
}
WebService.prototype.setShowErr = function(showErrHandler){
	this.showErr = showErrHandler;
	return this;
}
WebService.prototype.setShowLoading = function(showLoadingHandler){
    this.showLoading = showLoadingHandler;
    return this;
}
WebService.prototype.setHideLoading = function(hideLoadingHandler) {
    this.hideLoading = hideLoadingHandler;
    return this;
}
WebService.prototype.check = function(){
	if(!this.postParamUrl){
		this.showErr("参数获取地址为空错误");
		return false;
	}
	return true;
}
WebService.prototype.submit = function(){
	if(!this.check()) return;
	var _this = this;
	this.showHidder();
	this.showLoading();
	$.ajax({
		type:'POST',
		url:this.postParamUrl,
		data:this.postParams,
		dataType:'json',
		success:function(data){
		    _this.hideLoading();
			_this.hideHidder();
			if(data.success != "success"){
				_this.showErr(data.msg);
				return;
			}
			document.write(data.html);
		// 	var submitUrl = data.submitUrl;
		// 	if(!submitUrl){
		// 		_this.showErr("接口URL为空错误");
		// 		return;
		// 	}
		// 	_this.submitUrl = submitUrl;
		// 	var params = data.entity;
		// 	if(!params){
		// 		_this.showErr("参数结果为空错误");
		// 		return;
		// 	}
		// 	_this.params = params;
		// 	if(_this.checkParams(params)){
		// 		_this.initFormAndSub();
		// 	}
		//
		},
		error:function(data){
		    _this.hideLoading();
			_this.hideHidder();
			_this.showErr("用户网络不稳定，交易信息发送失败");
		}
	});

}
// WebService.prototype.initFormAndSub = function(){
// 	var $form = $("<form method='POST' action='"+this.submitUrl+"'></form>");
// 	for(var key in this.params){
// 		$form.append("<input type='hidden' name='"+key+"' value='"+this.params[key]+"'></input>");
// 	}
// 	$form.appendTo($("body"));
// 	($form.appendTo($("body")))[0].submit();
// }
