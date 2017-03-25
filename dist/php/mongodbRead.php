<?php
   // connect to mongodb
   $m = new MongoDB\Driver\Manager();
   echo "Connection to database successfully";

   // select a database
   $db = $m->test;
   echo "Database mydb selected".$db;
   $collection = $db->psytest;
   echo "Collection selected succsessfully".$collection;

   $cursor = $collection->find();
   // iterate cursor to display title of documents

   foreach ($cursor as $document) {
      echo $document["title"] . "\n";
   }
?>
