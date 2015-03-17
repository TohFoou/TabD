function saveOldTabs(){
	return new Promise(function(fulfill, reject){
		bg_window.old_tabs = []
		chrome.tabs.query({windowType: "normal"}, function(result){
			for(tab in result){
				bg_window.old_tabs.push({url: result[tab].url, id: result[tab].id})
			}
			if(bg_window.old_tabs != []){
				fulfill()
			}
			else{
				reject("No old tabs?")
			}
		})
	})
}

function deleteOldTabs(){
	for(tab in bg_window.old_tabs){
		chrome.tabs.remove(bg_window.old_tabs[tab].id)
	}
}

function restoreOldTabs(){
	for(tab in bg_window.old_tabs){
		chrome.tabs.create({url: bg_window.old_tabs[tab].url})
	}
}

$(document).ready(function(){
	bg_window = chrome.extension.getBackgroundPage()

	$("#start_button").click(function(){
		// save old tabs

		var save_promise = saveOldTabs()
		save_promise.then(function(){chrome.tabs.create({url: "chrome://extensions"})})
		save_promise.then(deleteOldTabs)
	})

	$("#end_button").click(function(){
		restoreOldTabs()
	})
})