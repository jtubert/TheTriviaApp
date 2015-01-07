//https://twitter.com/about/resources/widgets/widget_search
new TWTR.Widget({
  version: 2,
  type: 'search',
  search: 'MCHoliday',
  interval: 30000,
  title: 'MEDIACOM',
  subject: 'Happy Holidays to You!',
  width: 280,
  height: 800,
  theme: {
    shell: {
      background: '#de035d',
      color: '#ffffff' /*color of title text*/
    },
    tweets: {
      background: '#ffffff',
      color: '#000000',
      links: '#660033'
    }
  },
  features: {
    scrollbar: false,
    loop: true,
    live: true,
    behavior: 'default'
  }
}).render().start();

getUrlVars = function() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var i;
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

//https://github.com/jmathai/twitter-async

$(document).ready(function() {
	var username = getUrlVars().username || 'CasinoRaffleWin';	
	//$('#tweets').html("");
	console.log("tweetIt");
	var firstTime = true;
	// CasinoRaffleWin
	$('#tweets').liveTwitter(username, {limit: 50, refresh: true, mode: 'user_timeline'}, function(domNode, newTweets){
	    var tweets = $('.tweet');

	    if (tweets.length) {
	        $('#tweets').empty();
	        $('#tweets').append(tweets);
	    }

			console.log("liveTwitter");
				$('#tweets').columnize({ buildOnce:false,columns: 2,lastNeverTallest:false, });

		}
	);
	
});
