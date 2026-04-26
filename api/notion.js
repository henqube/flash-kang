export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { db, pageId } = req.query;

  const dbMap = {
    title:    process.env.NOTION_TITLE_DB,
    about:    process.env.NOTION_ABOUT_DB,
    timeline: process.env.NOTION_TIMELINE_DB,
    works:    process.env.NOTION_WORKS_DB,
    knowhow:  process.env.NOTION_KNOWHOW_DB,
    notes:    process.env.NOTION_NOTES_DB,
    contact:  process.env.NOTION_CONTACT_DB,
    footer:   process.env.NOTION_FOOTER_DB,
  };

  // 페이지 본문 요청 (Works 모달용)
  if (pageId) {
    try {
      const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
        },
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  const databaseId = dbMap[db];
  if (!databaseId) {
    return res.status(400).json({ error: 'Invalid db parameter' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
