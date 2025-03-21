import { useState } from "react";
import { Comment } from "../types";
import "./style.css";

type CommentFormProps = {
  onSubmit: (text: string) => void;
  replyTo: Comment | null;
  onCancelReply: () => void;
};

export const CommentForm = ({ onSubmit, replyTo, onCancelReply }: CommentFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    onSubmit(text);
    setText("");
  };

  return (
    <div className="comment-form">
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Add Comment"
        className="comment-input"
      />
      <div className="mobile-button-container">
        <img
          src="https://i.pravatar.cc/50?img=4"
          alt=""
          style={{ borderRadius: "100%" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="submit-button"
        >
          {replyTo ? "Reply" : "Send"}
        </button>
        {replyTo && (
          <button onClick={onCancelReply} className="cancel-reply">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};