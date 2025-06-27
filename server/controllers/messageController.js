import Message from '../models/Message.js'; 
import sanitizeHtml from 'sanitize-html';

// GET all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// POST a new message
export const createMessage = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    if (content.length > 200) {
      return res.status(400).json({ error: 'Message is too long (200 characters max).' });
    }

    // 🔒 Sanitize input to prevent HTML/script injection
    const cleanedContent = sanitizeHtml(content.trim(), {
      allowedTags: [],
      allowedAttributes: {},
    });

    const newMessage = await Message.create({ content: cleanedContent });
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};
