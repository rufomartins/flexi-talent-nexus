
const axios = require('axios');

const TEST_WEBHOOK_URL = 'http://localhost:3100/webhook';

// Test email payloads
const testEmails = [
  {
    name: 'Basic plain text email',
    payload: {
      envelope: {
        from: 'sender@example.com',
        to: ['recipient@example.com']
      },
      headers: {
        subject: 'Test Plain Text Email'
      },
      plain: 'This is a test email body',
      attachments: []
    }
  },
  {
    name: 'HTML email with multiple recipients',
    payload: {
      envelope: {
        from: 'sender@example.com',
        to: ['recipient1@example.com', 'recipient2@example.com']
      },
      headers: {
        subject: 'Test HTML Email'
      },
      plain: 'This is a test email body',
      html: '<p>This is a test email body</p>',
      attachments: []
    }
  },
  {
    name: 'Email with attachments',
    payload: {
      envelope: {
        from: 'sender@example.com',
        to: ['recipient@example.com']
      },
      headers: {
        subject: 'Test Email with Attachments'
      },
      plain: 'This is a test email with attachments',
      attachments: [
        {
          content_type: 'text/plain',
          file_name: 'test.txt',
          size: 1024,
          url: 'https://example.com/test.txt'
        }
      ]
    }
  }
];

// Run tests
async function runTests() {
  console.log('Starting webhook tests...\n');
  
  for (const test of testEmails) {
    console.log(`Testing: ${test.name}`);
    try {
      const startTime = Date.now();
      const response = await axios.post(TEST_WEBHOOK_URL, test.payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Success:', {
        statusCode: response.status,
        data: response.data,
        duration: `${Date.now() - startTime}ms`
      });
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    console.log('---\n');
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
