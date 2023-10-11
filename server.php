<?php
session_start();

// Dummy data for demonstration purposes
$users = [
    'user1' => ['discord_id' => '979798696889823284', 'balance' => 20000],
    'user2' => ['discord_id' => '863700938786734101', 'balance' => 20000]
];

// Discord OAuth2 credentials
$discord_client_id = '1161780454345683035';
$discord_client_secret = 'Ng8tCVID_JYF6SJlsAbHqLzokpkrYWgF';
$discord_redirect_uri = 'https://raze-raptor.github.io/FBet/';

// Discord OAuth2 endpoint to exchange code for token
$discord_token_url = 'https://discord.com/api/oauth2/token';

// Sample chat endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_SESSION['user'])) {
    // Logic to retrieve chat messages from a database or file
    // Example response: echo json_encode(['messages' => [['user' => 'user1', 'message' => 'Hello'], ['user' => 'user2', 'message' => 'Hi']]]);
}

// Discord OAuth2 callback endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['code'])) {
    $code = $_GET['code'];
    $token_request_data = [
        'grant_type' => 'authorization_code',
        'client_id' => $discord_client_id,
        'client_secret' => $discord_client_secret,
        'redirect_uri' => $discord_redirect_uri,
        'code' => $code,
    ];

    // Exchange authorization code for access token
    $token_request = curl_init($discord_token_url);
    curl_setopt($token_request, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($token_request, CURLOPT_POSTFIELDS, http_build_query($token_request_data));
    curl_setopt($token_request, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($token_request, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);

    $token_response = curl_exec($token_request);
    curl_close($token_request);

    $token_data = json_decode($token_response, true);

    if (isset($token_data['access_token'])) {
        // Use the access token to fetch user data from Discord API
        $discord_user_url = 'https://discord.com/api/v10/users/@me';
        $user_request = curl_init($discord_user_url);
        curl_setopt($user_request, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($user_request, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token_data['access_token']
        ]);

        $user_response = curl_exec($user_request);
        curl_close($user_request);

        $user_data = json_decode($user_response, true);

        // Check if the user exists in the dummy users array
        if (array_key_exists($user_data['id'], $users)) {
            $_SESSION['user'] = $users[$user_data['id']];
            echo json_encode(['success' => true, 'balance' => $_SESSION['user']['balance']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not authorized']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate with Discord']);
    }
}
?>
