// Vercel Serverless Function - Update ticket in index.json via GitHub API

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ticketId, newStatus } = req.body;

  if (!action || !ticketId) {
    return res.status(400).json({ error: 'Missing action or ticketId' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'thonyAGP';
  const REPO_NAME = 'lecteur-magic';
  const FILE_PATH = '.openspec/index.json';
  const BRANCH = 'master';

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    // 1. Get current file from GitHub
    const fileResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`);
    }

    const fileData = await fileResponse.json();
    const currentContent = JSON.parse(
      Buffer.from(fileData.content, 'base64').toString('utf-8')
    );

    // 2. Modify the content based on action
    let ticket;
    const today = new Date().toISOString().split('T')[0];

    switch (action) {
      case 'archive':
        ticket = currentContent.tickets.active.find((t) => t.id === ticketId);
        if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found in active' });
        }
        ticket.resolvedDate = today;
        ticket.lastAnalysis = today;
        currentContent.tickets.active = currentContent.tickets.active.filter(
          (t) => t.id !== ticketId
        );
        currentContent.tickets.archived.push(ticket);
        break;

      case 'unarchive':
        ticket = currentContent.tickets.archived.find((t) => t.id === ticketId);
        if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found in archived' });
        }
        delete ticket.resolvedDate;
        ticket.status = 'progress';
        ticket.lastAnalysis = today;
        currentContent.tickets.archived = currentContent.tickets.archived.filter(
          (t) => t.id !== ticketId
        );
        currentContent.tickets.active.push(ticket);
        break;

      case 'change-status':
        ticket =
          currentContent.tickets.active.find((t) => t.id === ticketId) ||
          currentContent.tickets.archived.find((t) => t.id === ticketId);
        if (!ticket) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
        ticket.status = newStatus;
        ticket.lastAnalysis = today;
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Update timestamp
    currentContent.lastUpdated = new Date().toISOString();

    // 3. Commit the updated file
    const newContent = JSON.stringify(currentContent, null, 2);
    const commitResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `docs(openspec): ${action} ticket ${ticketId}`,
          content: Buffer.from(newContent).toString('base64'),
          sha: fileData.sha,
          branch: BRANCH,
        }),
      }
    );

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json();
      throw new Error(`Failed to commit: ${JSON.stringify(errorData)}`);
    }

    return res.status(200).json({
      success: true,
      message: `Ticket ${ticketId} ${action} successfully`,
      ticket,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
