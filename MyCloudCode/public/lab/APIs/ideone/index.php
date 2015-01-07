<html>
<body>

<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
	<textarea rows="10" cols="80" name="code">for(var i=0;i<10;i++){print(i);}</textarea>
	<br>
	<input type="submit" />
</form>

</body>
</html>


<?
//docs: http://ideone.com/files/ideone-api.pdf
//http://ideone.com/

$user = 'jtubert'; //--> API username
$pass = 'rg@12345'; //--> API password
$lang = 35; //--> Source Language Code; Here is 1 => C++

$input = '';
$run = true;
$private = false;
$code = $_POST["code"];//"for(var i=0;i<10;i++){print(i);}";
 
//create new SoapClient
$client = new SoapClient( "http://ideone.com/api/1/service.wsdl" );
 
//create new submission
$result = $client->createSubmission( $user, $pass, $code, $lang, $input, $run, $private );

//$result = $client->getLanguages( $user, $pass );
//var_dump( $result );

 
//if submission is OK, get the status
if ( $result['error'] == 'OK' ) {
 
    $status = $client->getSubmissionStatus( $user, $pass, $result['link'] );

	

	
 
    if ( $status['error'] == 'OK' ) {
 
        //check if the status is 0, otherwise getSubmissionStatus again
        while ( $status['status'] != 0 ) {
            sleep( 3 ); //sleep 3 seconds
            $status = $client->getSubmissionStatus( $user, $pass, $result['link'] );
        }
 
        //finally get the submission results
        $details = $client->getSubmissionDetails( $user, $pass, $result['link'], true, true, true, true, true );
        if ( $details['error'] == 'OK' ) {
            //var_dump( $details );
			//echo $details['stderr'];
			if($details['stderr'] != ''){
				echo $details['stderr'];
			}else{
				echo $details['output'];
			}
        } else {
            //we got some error
            var_dump( $details );
        }
    } else {
        //we got some error
        var_dump( $status );
    }
} else {
    //we got some error
    var_dump( $result);
}
?>




