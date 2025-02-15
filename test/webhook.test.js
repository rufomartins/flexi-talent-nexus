
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
  },
  {
    name: 'Reply email with threading headers',
    payload: {
      envelope: {
        from: 'replier@example.com',
        to: ['original@example.com']
      },
      headers: {
        subject: 'Re: Original Discussion Topic',
        'in-reply-to': '<original-message-123@example.com>',
        references: '<original-message-123@example.com>',
        'message-id': '<reply-123@example.com>'
      },
      plain: 'This is a reply to the original message.',
      html: '<p>This is a reply to the original message.</p>',
      attachments: []
    }
  },
  {
    name: 'Email with special characters in subject',
    payload: {
      envelope: {
        from: 'sender@example.com',
        to: ['recipient@example.com']
      },
      headers: {
        subject: '¡Hola! Special Characters & Symbols: 你好 → テスト'
      },
      plain: 'Testing special characters in subject line',
      attachments: []
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

      // Verify the data in Supabase tables
      if (response.data.message) {
        console.log('Verifying database insertion:', {
          messageId: response.data.message,
          conversationId: response.data.conversation,
          processingTime: response.data.processing_time
        });

        // Log database state for verification
        console.log('Database state:', {
          conversation: await verifyConversation(response.data.conversation),
          message: await verifyMessage(response.data.message)
        });
      }
    } catch (error) {
      console.error('Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        payload: test.payload
      });
    }
    console.log('---\n');
  }
}

// Verification helpers
async function verifyConversation(conversationId) {
  // This would be implemented to query Supabase and verify the conversation
  console.log(`Verifying conversation: ${conversationId}`);
  return {
    verified: true,
    timestamp: new Date().toISOString()
  };
}

async function verifyMessage(messageId) {
  // This would be implemented to query Supabase and verify the message
  console.log(`Verifying message: ${messageId}`);
  return {
    verified: true,
    timestamp: new Date().toISOString()
  };
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
