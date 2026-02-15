import { useEffect, useState } from 'react';
import { getMessages, type MessageRecord } from '../../services/api';

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    void loadMessages();
  }, [limit]);

  async function loadMessages() {
    try {
      setLoading(true);
      setError(null);
      const data = await getMessages(limit);
      setMessages(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  const contactMessages = messages.filter((msg) => msg.type === 'contact');
  const quoteMessages = messages.filter((msg) => msg.type === 'quote');

  const renderTable = (rows: MessageRecord[]) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              rows.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="font-medium text-gray-900">{msg.name}</div>
                    <div className="text-xs text-gray-500">{msg.email}</div>
                    <div className="text-xs text-gray-500">{msg.phone || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div>{msg.subject || msg.teamName || '—'}</div>
                    {msg.quantity ? (
                      <div className="text-xs text-gray-500">Qty: {msg.quantity}</div>
                    ) : null}
                    {msg.logoUrl ? (
                      <a
                        href={msg.logoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View logo
                      </a>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-lg">
                    {msg.message || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-sm text-gray-600">Contact us and custom kit inquiries</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Contact messages</h3>
            <p className="text-xs text-gray-500">{contactMessages.length} total</p>
          </div>
        </div>
        {renderTable(contactMessages)}

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Custom kit requests</h3>
            <p className="text-xs text-gray-500">{quoteMessages.length} total</p>
          </div>
        </div>
        {renderTable(quoteMessages)}
      </div>
    </div>
  );
}
