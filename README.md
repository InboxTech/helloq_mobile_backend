backend-js/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── match.controller.js
│   │   ├── chat.controller.js
│   │   ├── report.controller.js
│   │   └── payment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Match.js
│   │   ├── Message.js
│   │   ├── Report.js
│   │   └── Like.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   ├── chat.js
│   │   ├── reports.js
│   │   └── payments.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── match.service.js
│   │   ├── moderation.service.js
│   │   └── analytics.service.js
│   ├── sockets/
│   │   └── chat.js
│   ├── utils/
│   │   ├── sms.js
│   │   ├── s3.js
│   │   └── kafka.js
│   └── server.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md