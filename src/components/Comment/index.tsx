import { Comment as CommentType } from "../types";
import "./style.css";
import img from "../../imgs/Reply.png";
import img1 from "../../imgs/Shape(1).png";
import img2 from "../../imgs/Shape.png";
type CommentProps = {
  comment: CommentType;
  parentId?: string;
  onReply: (comment: CommentType) => void;
  onDelete: (commentId: string, parentId?: string) => void;
  onRepostCountChange: (commentId: string, newCount: number) => void;
};

const CURRENT_USER = "John";

export const Comment = ({
  comment,
  parentId,
  onReply,
  onDelete,
  onRepostCountChange,
}: CommentProps) => {
  const handleRepostChange = (num: number) => {
    onRepostCountChange(comment.id, comment.repostCount + num);
  };

  return (
    <div className="comment">
      <div className="comment-left">
        <div>
          <div className="repost-counter">
            <button
              onClick={() => handleRepostChange(1)}
              className="counter-button"
            >
              +
            </button>
            <span className="repost-count">{comment.repostCount}</span>
            <button
              onClick={() => handleRepostChange(-1)}
              className="counter-button"
            >
              -
            </button>
          </div>
        </div>
        <div className="main-comment">
          <div className="comment-header">
            <div className="user-information">
              <img
                src={comment.avatarUrl}
                alt={`${comment.username}'s avatar`}
                className="avatar"
              />
              <p className="username">{comment.username}</p>
            </div>
            <div className="comment-actions">
              {comment.username !== CURRENT_USER && (
                <>
                  <img src={img} alt="" className="reply-img" />
                  <button
                    onClick={() => onReply(comment)}
                    className="reply-button"
                  >
                    Reply
                  </button>
                </>
              )}
              {comment.username === CURRENT_USER && (
                <>
                  <img src={img2} alt="" />
                  <button
                    onClick={() => onDelete(comment.id, parentId)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <img src={img1} alt="" />
                  <button className="edit-button">edit</button>
                </>
              )}
            </div>
          </div>
          <p className="comment-text">{comment.text}</p>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              parentId={comment.id}
              onReply={onReply}
              onDelete={onDelete}
              onRepostCountChange={onRepostCountChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
