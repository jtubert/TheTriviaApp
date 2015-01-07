var hideTwitterAttempts = 0;
function hideTwitterBoxElements() {
    setTimeout( function() {
        if ( $('[id*=twitter]').length ) {
        $('[id*=twitter]').each( function(){
            var ibody = $(this).contents().find( 'body' );

            if ( ibody.find( '.timeline .stream .h-feed li.tweet' ).length ) {
            ibody.find( '.customisable-border' ).css( 'border', 0 );
            ibody.find( '.timeline' ).css( 'background-color', '#004A7B' ); //theme: shell: background:
            ibody.find( 'ol.h-feed' ).css( 'background-color', '#0575A1' ); //theme: tweets: background:
            ibody.find( 'ol.h-feed' ).css( 'border-radius', '5px 5px 5px 5px' );
            ibody.find( 'li.tweet' ).css( 'border-bottom', '1px dotted #FFFFFF' ); //theme: tweets: color:
            ibody.find( 'li.tweet' ).css( 'color', '#FFFFFF' ); //theme: tweets: color:
            ibody.find( '.customisable:link' ).css( 'color', '#07E0EB' ); //theme: tweets: links:
            ibody.find( '.footer' ).css( 'visibility', 'hidden' ); //hide reply, retweet, favorite images
            ibody.find( '.footer' ).css( 'min-height', 0 ); //hide reply, retweet, favorite images
            ibody.find( '.footer' ).css( 'height', 0 ); //hide reply, retweet, favorite images
            ibody.find( '.avatar' ).css( 'height', 0 ); //hide avatar
            ibody.find( '.avatar' ).css( 'width', 0 ); //hide avatar
            ibody.find( '.p-nickname' ).css( 'font-size', 0 ); //hide @name of tweet
            ibody.find( '.p-nickname' ).css( 'visibility', 'hidden' ); //hide @name of tweet
            ibody.find( '.e-entry-content' ).css( 'margin', '-25px 0px 0px 0px' ); //move tweet up (over @name of tweet)
            ibody.find( '.dt-updated' ).css( 'color', '#07E0EB' ); //theme: tweets: links:
            ibody.find( '.full-name' ).css( 'margin', '0px 0px 0px -35px' ); //move name of tweet to left (over avatar)
            ibody.find( 'h1.summary' ).replaceWith( '<h1 class="summary"><a class="customisable-highlight" title="Tweets from fundSchedule" href="https://twitter.com/fundschedule" style="color: #FFFFFF;">fundSchedule</a></h1>' ); //replace Tweets text at top
            ibody.find( '.p-name' ).css( 'color', '#07E0EB' ); //theme: tweets: links:
            }
            else {
                $(this).hide();
            }
        });
        }
        hideTwitterAttempts++;
        if ( hideTwitterAttempts < 3 ) {
            hideTwitterBoxElements();
        }
    }, 150);
}

// somewhere in your code after html page load
hideTwitterBoxElements();