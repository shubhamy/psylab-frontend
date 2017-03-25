<?php
require_once 'db_con.php';
$query = "SELECT * from orders ORDER BY orderid ASC";
$result = mysqli_query($con, $query);
$arr = array();
if(mysqli_num_rows($result) != 0) {
	while($row = mysqli_fetch_assoc($result)) {
			$arr[] = $row;
	}
}
unset($con);
echo $json_info = json_encode($arr);
?>
