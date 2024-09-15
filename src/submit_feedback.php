<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $feedback = htmlspecialchars($_POST['feedback']);

    // Here, you can send the data to a database, send an email, etc.
    // For now, we can just display it.
    
    echo "Thank you, $name, for your feedback!";
    echo "<br>Email: $email";
    echo "<br>Feedback: $feedback";
}
?>
