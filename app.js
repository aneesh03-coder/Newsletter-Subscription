//jshint esversion:6

/*We are requiring the various native and external modules
express for the nodeJS framework
bodyParser for getting the POST request data back from the html page to Server
request-For getting or POSTing to an external API-Its again a native modules
https-FOr requesting the data from an external source
*/
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Its a dynamic port which Heroku will decide which port it wants to deploy it on
app.listen(process.env.PORT || 3000,function(){
  console.log("The server is running on port 3000");
});

app.get("/",function(req,res){
res.sendFile(__dirname+"/signup.html");

});

app.post("/",function(req,res){
  const firstName=req.body.firstName;
  const lastName=req.body.lastName;
  const emailID=req.body.emailID;
/*The data format the Chimmail accepts*/

  const data={
    members: [
      {
        email_address:emailID,
        status:"subscribed",
        merge_fields:
        {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  /*The data that a Chimpmail accepts has to be in the form of JSON and minified*/
  const jsonData=JSON.stringify(data);
  /*Endpoint with 19 as the replacement for X and the list ID at the end*/
  const url="https://us19.api.mailchimp.com/3.0/lists/d9eaf2529d";
  // The format of data request to be send to an external server
  const options={
    method:"POST",
    auth:""
  };
  const request=https.request(url,options,function(response){
    if(response.statusCode === 200)
    {
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    });
  });
request.write(jsonData);
request.end();
});


app.post("/failure",function(req,res){
  res.redirect("/");
});
