export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Handle preflight request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { name, email, subject, message } = req.body;

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    "https://xddbeclwfojyrmwykqwz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZGJlY2x3Zm9qeXJtd3lrcXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjM3MDMsImV4cCI6MjA2MjAzOTcwM30.Pa8CfI046FVDh5qsOvv1-sT1e2Hw8UmzXAmiboY9iBI"
  );

  const { error } = await supabase
    .from('messages')
    .insert([{ name, email, subject, message }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Message sent successfully!" });
}
