<?php
// Dummy data for demonstration purposes
$users = [
    'user1' => ['password' => 'password1', 'balance' => 450],
    'user2' => ['password' => 'password2', 'balance' => 450]
];

// Sample login endpoint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (array_key_exists($username, $users) && $users[$username]['password'] === $password) {
        echo json_encode(['success' => true, 'balance' => $users[$username]['balance']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}

// Sample chat endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Logic to retrieve chat messages from a database or file
    // Example response: echo json_encode(['messages' => [['user' => 'user1', 'message' => 'Hello'], ['user' => 'user2', 'message' => 'Hi']]]);
}
?>
