function MyAlert(alertMsg,clickHanderler,useCancel){
	this.useCancel=useCancel;
	this.clickHanderler = clickHanderler||$.noop;
	this.$hider = null;
	this.alertMsg = alertMsg;
	this.okBtnValue="确定";
	this.cancelBtnValue="取消";
	this.alertTitle="温馨提示";
	this.$title = null;
	this.init();
}
MyAlert.prototype.init = function(){
	this.$hider = $("<div style='width:100%;height:100%;position:fixed;z-index:20;left:0;top:0;background-color:rgba(0,0,0,0.3);'></div>");
	var $alertDiv = $("<div style='text-align:center;padding:20px;width:60%;position:absolute;top:40%;left:50%;margin-left:-30%;background:#fff;border-radius:5px;'></div>")
	.append("<div style='font-size:26px;border-bottom:1px solid #e5e5e5;padding-bottom:10px;'>"+this.alertTitle+"</div>")
	.append("<div style='font-size:16px;border-bottom:1px solid #e5e5e5;padding:5px 0;'>"+this.alertMsg+"</div>");
	var $btnDiv = $("<div style='padding-top:10px;font-size:16px;color:#fff;'></div>").appendTo($alertDiv);
	$("<div style='width:"
		+(this.useCancel?45:"100")
		+"%;border-radius:2px;background:#F15026;padding:5px 15px;float:left'>"
		+this.okBtnValue+"</div>")
		.click(this.hide(1)).appendTo($btnDiv);
	if(this.useCancel){
		$("<div style='width:45%;border-radius:2px;background:#c0c0c0;padding:5px 15px;float:right;'>"+this.cancelBtnValue+"</div>")
		.click(this.hide(0)).appendTo($btnDiv);
	}
	$btnDiv.append("<div style='clear:both;'></div>");
	this.$hider.append($alertDiv).appendTo($("body"));
	var height=$alertDiv.outerHeight();
	$alertDiv.css("margin-top",(-height/2)+"px");
}
MyAlert.prototype.hide=function(flag){
	var _this=this;
	return function(){
		_this.$hider.remove();
		_this.clickHanderler(flag);
	}
}
function myAlert(str,click,useCancel){
	var overflow="";
	var $hidder=null;
	var clickHandler=click||$.noop;
	var myClickHandler=function(){
		$hidder.remove();
		$("body").css("overflow",overflow);
		clickHandler($(this).hasClass("queryBtn"));
	};
	var init=function(){
		$hidder = $("<div style='width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;text-align: center;position:fixed;left:0;top:0;'></div>");
		var $myalert = $("<div style='width:70%;position:absolute;top:30%;left:15%;padding:15px;background:#fff;border-radius:5px;'>"+
			"<div style='padding-bottom:10px;border-bottom:1px solid #e5e5e5;font-size:20px;color:#F15026;'>温馨提示</div></div>")
			.appendTo($hidder);
		$("<div style='padding:10px 0;color:#333;border-bottom:1px solid #e5e5e5;'>"+str+"</div>").appendTo($myalert);
		var $myalert_btn_div = $("<div style='padding-top:10px;'></div>").appendTo($myalert);
		var $okBtn = $("<div style='float:left;width:100%;color:#eee;background:#009159;border-radius:2px;padding:7px 0;'>确定</div>")
			.appendTo($myalert_btn_div).click(myClickHandler);
		if(useCancel){
			$okBtn.css("width","50%").css("border-right","5px solid #fff");
			$("<div style='float:left;width:50%;border-left:5px solid #fff;border-radius:2px;padding:7px 0;color:#fff;background:#ccc;'>取消</div>")
			.appendTo($myalert_btn_div).click(myClickHandler);
		}
		overflow=$("body").css("overflow");
	    $("body").css("overflow","hidden").append($hidder);
	};
	init();
}
