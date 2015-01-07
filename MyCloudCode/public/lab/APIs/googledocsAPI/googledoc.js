//https://developers.google.com/google-apps/spreadsheets/
//https://developers.google.com/gdata/samples/spreadsheet_sample

//THE SPREADSHEET
//https://docs.google.com/spreadsheet/ccc?key=0AnFmfAsjQRCLdG0wZ3Npcm5GZDVET2pOZVRfSE1IcUE&hl=en_US#gid=0
//<script type="text/javascript" src="http://spreadsheets.google.com/feeds/list/0AnFmfAsjQRCLdG0wZ3Npcm5GZDVET2pOZVRfSE1IcUE/od6/public/values?alt=json-in-script&callback=loadContent"></script>
var com={jtubert:{}};
com.jtubert.googledoc = function(){
	var self = this;
	var content;
	var endpoint = "http://spreadsheets.google.com/feeds/list/";	
	

	this.init = function(obj){
		var url = endpoint +obj.spreadsheetID + "/od6/public/values?alt=json-in-script&callback=?";
		console.log(url);

        $.getJSON(url,{}, self.onData);
	}
	
	this.onData = function(json) { 
		content = json;
		var columnLabels = self.getColumnLabels(content);
		var rows = content.feed.entry;
		
		var tableContent = '<table border="1" >';
		
		for(var j=0;j<rows.length;j++){
			//add table headers
			if(j == 0){
				tableContent +="<tr>";
				for(var h=0;h<columnLabels.length;h++){
					tableContent +="<th><b>" + columnLabels[h] +"</b></th>";
				}
				tableContent +="</tr>";
			}
			
			
			tableContent +="<tr>";
			//draw row
			for(var i=0;i<columnLabels.length;i++){
				var currentID = columnLabels[i];
				tableContent +="<td>" + self.getCellByName(currentID,j)+"</td>";
			}
			tableContent +="</tr>";
		}
		
		tableContent +="</table>";	
		
		$("body").html(tableContent);	
	}
	
	this.getCellByName = function(name,index){
		return content.feed.entry[index]["gsx$"+name].$t
	}
	
	this.getColumnLabels = function(json){
		var labels = json.feed.entry[0];
		var idsArr = [];
		for(var i in labels){
			if(i.indexOf("gsx$") == 0 && i != "gsx$_cssly"){
				idsArr.push(i.substr(4,i.length));
			}
		}
		return idsArr;
	}
	
	return this;
}




