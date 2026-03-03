<?php

return [

    'paths' => ['api/*', 'graphql', 'graphql/*'],

    'allowed_methods' => ['*'],

    // React Dev Server
    'allowed_origins' => ['http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];