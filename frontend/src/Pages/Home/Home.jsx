import { useState } from "react";
import { Container, Grid, Grow } from "@mui/material";

import Stories from "../../components/Stories/Stories";
import Form from "../../components/Form/Form";

import styles from "./Home.module.css";

function Home(props) {
  const { author } = props;
  const [curId, setCurId] = useState(null);

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          className={styles.gridContainer}
          justifyContent="space-evenly"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Stories setCurId={setCurId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Form curId={curId} setCurId={setCurId} author={author} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}

export default Home;
