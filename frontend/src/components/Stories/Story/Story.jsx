import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  Typography,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
  ButtonBase,
} from "@mui/material/";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useLikeStoryMutation,
  useDeleteStoryMutation,
} from "../../../features/api";

import storyImg from "../../../assets/images/thumb.jpg";
import styles from "./Story.module.css";

function Story(props) {
  const { story, setCurId } = props;
  const navigate = useNavigate();
  const [likeStory] = useLikeStoryMutation();
  const [deleteStory] = useDeleteStoryMutation();
  const teller = JSON.parse(localStorage.getItem("profile"));

  const timeAgo = DateTime.fromISO(story.createdAt).toRelative();

  const openStory = () => {
    navigate(`/stories/${story._id}`);
  };

  const Likes = () => {
    if (story.likes.length > 0) {
      return story.likes.find((like) => like === teller?._id) ? (
        <>
          <ThumbUpIcon fontSize="small" />
          &nbsp;Liked:&nbsp;
          {story.likes.length}
        </>
      ) : (
        <>
          <ThumbUpAltOutlinedIcon fontSize="small" />
          &nbsp;Like:&nbsp;{story.likes.length}
        </>
      );
    }
    return (
      <>
        <ThumbUpAltOutlinedIcon fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  return (
    <Card className={styles.card}>
      <CardMedia
        className={styles.media}
        image={story.image || storyImg}
        title={story.title}
        onClick={openStory}
      />
      <div className={styles.overlay}>
        <Typography variant="h6">{story.author}</Typography>
        <Typography variant="body2">{timeAgo}</Typography>
      </div>
      {teller?._id === story.creator && (
        <div className={styles.overlay2}>
          <Button
            style={{ color: "white" }}
            size="small"
            onClick={() => setCurId(story._id)}
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
      )}
      <div className={styles.tags}>
        <Typography variant="body2">
          {story.tags.map((tag) => `#${tag} `)}
        </Typography>
      </div>
      <Typography
        className={styles.title}
        variant="h6"
        component="div"
        onClick={openStory}
      >
        {story.title}
      </Typography>
      <CardContent className={styles.content} onClick={openStory}>
        <Typography variant="body2" color="textSecondary">
          {story.content.substring(0, 50)}...
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!teller}
          onClick={() => likeStory(story)}
        >
          <Likes />
        </Button>
        {teller?._id === story.creator && (
          <Button size="small" color="error" onClick={() => deleteStory(story)}>
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Story;
