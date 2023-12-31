import { useEffect, useState } from "react";
import FileBase64 from "react-file-base64";
import { Typography, TextField, Paper, Button } from "@mui/material/";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  useGetStoryQuery,
  useAddNewStoryMutation,
  useUpdateStoryMutation,
} from "../../features/api";
import styles from "./Form.module.css";

export default function Form(props) {
  const { author, curId, setCurId } = props;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);

  const [addNewStory, { isLoading }] = useAddNewStoryMutation();
  const { data: story } = useGetStoryQuery(curId);
  const [updateStory] = useUpdateStoryMutation();

  useEffect(() => {
    if (curId) {
      setTitle(story.title);
      setContent(story.content);
      setTags(story.tags.join(" "));
    }
  }, [story]);

  const handelCancelEdit = () => {
    setCurId(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  const canSave = [title, content, tags].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (curId && canSave) {
      try {
        await updateStory({
          id: curId,
          author,
          title,
          content,
          tags,
          image,
        }).unwrap();
        setTitle("");
        setContent("");
        setTags("");
        setImage("");
        setCurId(null);
      } catch (error) {
        console.error("Failed to save post:", error);
      }
    } else if (canSave) {
      try {
        await addNewStory({
          author,
          title,
          content,
          tags,
          image,
        }).unwrap();
        setTitle("");
        setContent("");
        setTags("");
        setImage("");
      } catch (error) {
        console.error("Failed to save post:", error);
      }
    }
  };

  if (!author) {
    return (
      <Paper className={styles.emptyPaper} elevation={6}>
        <Typography variant="h6" align="center">
          Log in to create stories and like other stories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={styles.paper} elevation={6}>
      <form
        className={styles.postForm}
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {curId ? "Editing" : "Tell"} a Story
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          value={title}
          fullWidth
          required
          onChange={handleTitleChange}
        />
        <TextField
          name="story"
          variant="outlined"
          label="Story"
          value={content}
          fullWidth
          multiline
          rows={3}
          required
          onChange={handleContentChange}
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          value={tags}
          fullWidth
          required
          onChange={handleTagsChange}
        />
        <div className={styles.fileInput}>
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => setImage(base64)}
          />
        </div>

        {curId ? (
          <>
            <Button
              className={styles.submitButton}
              variant="contained"
              color="error"
              size="lg"
              type="submit"
              fullWidth
            >
              Update
            </Button>
            <Button
              color="primary"
              size="lg"
              fullWidth
              onClick={handelCancelEdit}
            >
              Cancel
            </Button>
          </>
        ) : (
          <LoadingButton
            className={styles.submitButton}
            variant="contained"
            color="error"
            size="lg"
            type="submit"
            fullWidth
            loading={isLoading}
          >
            Post
          </LoadingButton>
        )}
      </form>
    </Paper>
  );
}
