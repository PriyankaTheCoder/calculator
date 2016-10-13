angular.module('calculatorApp',[])
.controller('calculatorCntrl',['$scope','$window',function(scope,window){
	scope.lastTransactions = [];
	scope.result='0';
	scope.operators=['*','+','-','/'];
	scope.done = false;
	scope.resultString='';
	scope.lastCalculations=[];
	scope.calculations=[];
	scope.isMobile = false;
	angular.element(window).bind('orientationchange',function(){
		scope.isMobile = true;
	});
	// check backspace key and delete key. backspace or delete button will remove character one at a time
	scope.checkForBackSpaceandDelete = function(cursorPos){
		if(scope.result.length === 1 || scope.result=== '' || cursorPos === 0){
			scope.result = '0';
			scope.resultString='';
		}else{
			scope.result = scope.result.slice(0,scope.result.length-1);
			scope.resultString= scope.resultString.slice(0,scope.resultString.length-1);;
		}
	};
	
	// calculations (+,-,/,*)
	scope.calculateResults = function(result){
		return eval(result);
	};
	
	//check for operators [+,-,*,/]; replace the last character( if operator ) or append the result  with the current operator.
	scope.checkForOperators = function(key){
		if(scope.result!=='0'){	
			if(scope.operators.indexOf(scope.result.charAt(scope.result.length-1)) !== -1 ){
				scope.result = scope.result.slice(0,scope.result.length-1);
				scope.resultString = scope.resultString.slice(0,scope.resultString.length-1);
			}
			scope.result = scope.calculateResults(scope.result);
			scope.result+=key;
			scope.resultString = scope.resultString+" "+key;
		}
	};
	
	//check for numbers
	scope.checkNumericValues = function(key){
		scope.resultString = scope.resultString+" "+key;
		if(scope.result==='0'){
			scope.result=key;
		}else{
			scope.result+=key;
		}
	};
	
	// on press enter show the result and store it in lastCalculations
	scope.getResults = function(){
		if(scope.operators.indexOf(scope.result.charAt(scope.result.length-1)) !== -1){
			scope.result = scope.result.slice(0,scope.result.length-1);
			scope.resultString = scope.resultString.slice(0,scope.resultString.length-1);
		}
		scope.result = eval(scope.result).toString();
		if(scope.calculations.length === 5){
			scope.calculations.pop();
		}
		if(scope.resultString !== ''){
				scope.resultString = scope.resultString+" = "+scope.result;
				scope.calculations.unshift(scope.resultString);
				scope.resultString = '';
			}
		if(scope.isMobile){
			scope.lastCalculations = scope.calculations.slice(0,2);
		}else{
			scope.lastCalculations = scope.calculations;
		}
		scope.done = true;
	}
	
	// check value on keydown
	scope.checkValue = function(event){
		if(scope.done){
			scope.result = '0';
		}
		scope.done = false;
		var charcode = event.which?event.which:event.keyCode;
		var cursorPos = jQuery('#calculationResult').prop('selectionStart');
		if(charcode ===8 || charcode === 46){  
		// check for backspace and delete key
			scope.checkForBackSpaceandDelete(cursorPos);
		}else if(charcode === 13){
			scope.getResults();
		}else if(((charcode === 187 || charcode === 56 )&& event.shiftKey) ||((charcode === 191 || charcode === 189 )&& !event.shiftKey)){
		// check for operators
			scope.checkForOperators(event.key);
		}else if(((charcode ===190 && scope.result.indexOf('.')=== -1) ||(charcode >=48 && charcode <= 57)) && !event.shiftKey ){ 
			// any other keys except numbers are not allowed
			scope.checkNumericValues(event.key);
		}
		event.preventDefault();
	};
	
	scope.onClear = function(){
		scope.result = '0';
		scope.resultString='';
	};
	
	scope.onReset = function(){
		if(scope.done){
			scope.result = '0';
			scope.resultString='';
		}else{
			if(scope.result === '0' || scope.result.length === 1){
				scope.result ='0';
			}else{
				scope.result = scope.result.slice(0,scope.result.length-1);
			}
			scope.resultString= scope.resultString.slice(0,scope.resultString.length-1);;
		}
	};
	
	scope.onEnterValue = function(event){
		if(scope.done){
			scope.result = '0';
		}
		scope.done = false;
		var value = event.target.value;
		if(scope.operators.indexOf(value) !== -1){
			scope.checkForOperators(value);
		}else if(value === "="){
			scope.getResults();
		}else if(value === "."){
			if(scope.result.indexOf('.')=== -1){
				scope.result+=value;
				scope.resultString = scope.resultString+" "+value;
			}
		}else{
			scope.checkNumericValues(value);
		}
		jQuery('#calculationResult').focus();
		event.preventDefault();
		event.stopPropagation();
	};

}]);