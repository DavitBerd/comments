import { useState, useEffect } from "react";
import { Comment as CommentType } from "../types";
import { Comment } from "../Comment";
import { CommentForm } from "../CommentForm";
import "./style.css";

const LOCAL_STORAGE_KEY = "comments_data";
const CURRENT_USER = "CurrentUser";

const initialComments: CommentType[] = [
  {
    id: "1",
    username: "Alice",
    avatarUrl: "https://i.pravatar.cc/50?img=1",
    text: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You’ve nailed the design and the responsiveness at various breakpoints works really well.",
    repostCount: 3,
    replies: [],
  },
  {
    id: "2",
    username: "Charlie",
    avatarUrl: "https://i.pravatar.cc/50?img=3",
    text: "Woah, your project looks awesome! How long have you been coding for? I’m still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    repostCount: 2,
    replies: [
      {
        id: "3",
        username: "Alice",
        avatarUrl: "https://i.pravatar.cc/50?img=1",
        text: "@maxblagun If you’re still new, I’d recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It’s very tempting to jump ahead but lay a solid foundation first.",
        repostCount: 1,
        replies: [],
      },
    ],
  },
];
const findCommentPath = (
  comments: CommentType[],
  targetId: string
): CommentType[] | null => {
  for (const comment of comments) {
    if (comment.id === targetId) {
      return [comment];
    }
    if (comment.replies && comment.replies.length > 0) {
      const path = findCommentPath(comment.replies, targetId);
      if (path) {
        return [comment, ...path];
      }
    }
  }
  return null;
};
const updateCommentReplies = (
  comments: CommentType[],
  targetId: string,
  newReply: CommentType
): CommentType[] => {
  return comments.map((c) => {
    if (c.id === targetId) {
      return { ...c, replies: [...(c.replies || []), newReply] };
    }
    if (c.replies && c.replies.length > 0) {
      return {
        ...c,
        replies: updateCommentReplies(c.replies, targetId, newReply),
      };
    }
    return c;
  });
};

export const CommentSection = () => {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [replyTo, setReplyTo] = useState<CommentType | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    commentId: string;
    parentId?: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored comments:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  }, [comments]);

  const updateRepostCount = (commentId: string, newCount: number) => {
    const updateCountRecursive = (comments: CommentType[]): CommentType[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, repostCount: newCount };
        }
        if (comment.replies) {
          return { ...comment, replies: updateCountRecursive(comment.replies) };
        }
        return comment;
      });
    };

    setComments((prev) => updateCountRecursive(prev));
  };

  const addComment = (text: string) => {
    if (!text.trim()) return;

    const newComment: CommentType = {
      id: Date.now().toString(),
      username: CURRENT_USER,
      avatarUrl: "https://i.pravatar.cc/50?img=4",
      text: replyTo ? `@${replyTo.username} ${text}` : text,
      repostCount: 0,
      replies: [],
    };

    if (replyTo) {
      const path = findCommentPath(comments, replyTo.id);
      const parentId =
        path && path.length > 1 ? path[path.length - 2].id : replyTo.id;
      setComments((prev) => updateCommentReplies(prev, parentId, newComment));
      setReplyTo(null);
    } else {
      setComments((prev) => [...prev, newComment]);
    }
  };

  const deleteComment = (commentId: string, parentId?: string) => {
    setDeleteConfirm({ commentId, parentId });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    const { commentId, parentId } = deleteConfirm;

    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId && c.replies
            ? { ...c, replies: c.replies.filter((r) => r.id !== commentId) }
            : c
        )
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="comment-section-wrapper">
      {deleteConfirm && (
        <div className="delete-confirm-dialog">
          <div className="delete-confirm-content">
            <h2>DELETE COMMENT</h2>
            <p>
              Are you sure you want to delete this comment? This will remove the
              comment and can't be undone.
            </p>
            <div className="delete-confirm-buttons">
              <button onClick={cancelDelete} className="cancel-button">
                NO, DELETE
              </button>
              <button onClick={confirmDelete} className="confirm-button">
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="comment-section">
        <div className="comments-list">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={setReplyTo}
              onDelete={deleteComment}
              onRepostCountChange={updateRepostCount}
            />
          ))}
        </div>
        <CommentForm
          onSubmit={addComment}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
        />
      </div>
    </div>
  );
};
