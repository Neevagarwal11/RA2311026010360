import React, { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import Link from "next/link";
import InboxIcon from "@mui/icons-material/Inbox";
import ListIcon from "@mui/icons-material/List";
import FilterBar from "@/components/FilterBar";
import PriorityInbox from "@/components/PriorityInbox";
import { useNotifications } from "@/hooks/useNotifications";
import { logFrontend } from "@/middleware/logger";
import type { FetchNotificationsParams } from "@/lib/api";

export default function IndexPage() {
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState
    FetchNotificationsParams["notification_type"] | "All"
  >("All");

  const { priorityNotifications, loading, error, viewedIds, markViewed } =
    useNotifications({
      topN,
      notification_type: filterType === "All" ? undefined : filterType,
      pollInterval: 30_000,
    });

  const handleTopNChange = async (n: number) => {
    setTopN(n);
    await logFrontend(
      "info",
      "page",
      `Priority Inbox: user changed topN to ${n}`
    );
  };

  const handleTypeChange = async (
    t: FetchNotificationsParams["notification_type"] | "All"
  ) => {
    setFilterType(t);
    await logFrontend(
      "info",
      "page",
      `Priority Inbox: user changed filter type to "${t}"`
    );
  };

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <InboxIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700} flexGrow={1}>
            Notifications
          </Typography>
          <Link href="/all" passHref legacyBehavior>
            <Button
              component="a"
              color="inherit"
              startIcon={<ListIcon />}
              size="small"
            >
              All Notifications
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <FilterBar
          selectedType={filterType}
          onTypeChange={handleTypeChange}
          topN={topN}
          onTopNChange={handleTopNChange}
          showTopN
        />
        <PriorityInbox
          notifications={priorityNotifications}
          viewedIds={viewedIds}
          onView={markViewed}
          loading={loading}
          error={error}
          topN={topN}
        />
      </Container>
    </>
  );
}