function MessageBubble({ message }) {
  return (
    <div className={`message-bubble ${message.sender}`}>
      <p>{message.text}</p>
      <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
    </div>
  );
}
