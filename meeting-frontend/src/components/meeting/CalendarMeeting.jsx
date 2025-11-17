// CRITICAL FIX: CalendarMeeting.jsx - Corrected Data Source Issue with New UI Design

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Chip,
  Divider,
  Stack,
  useTheme,
  alpha,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
} from "@mui/material";
import {
  CalendarToday,
  Edit,
  Delete,
  VideoCall,
  ExpandMore,
  ArrowBack,
  ArrowForward,
  GroupAdd,
  CheckCircle,
  Warning,
  Info,
  Group,
  Schedule,
  Person,
  AccessTime,
  Event,
  EventAvailable,
  Language,
  LocationOn,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCalendar } from "../../hooks/useCalendar";
import BulkInvite from "../invitations/BulkInvite";
import ErrorDialog from "../common/ErrorDialog";

// ===== NEW STYLED COMPONENTS FOR MODERN UI =====

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const ModernCard = styled(Card)(({ theme }) => ({
  maxWidth: 1400,
  margin: "0 auto",
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
  background: "#ffffff",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
    borderRadius: theme.spacing(1),
  },
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    margin: 0,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: theme.spacing(4),
  textAlign: "center",
  color: "white",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StepperSection = styled(Box)(({ theme }) => ({
  background: "#f8f9fa",
  padding: theme.spacing(2, 4),
  borderBottom: "1px solid #e0e0e0",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5, 1),
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "auto",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    minHeight: "auto",
  },
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: "auto",
  maxHeight: "none",
  [theme.breakpoints.down("lg")]: {
    maxHeight: "none",
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
  },
}));

const SummaryPanel = styled(Box)(({ theme }) => ({
  width: "400px",
  background: "#f8f9fa",
  padding: theme.spacing(3),
  borderLeft: "1px solid #e0e0e0",
  overflowY: "auto",
  maxHeight: "none",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
    borderLeft: "none",
    borderTop: "1px solid #e0e0e0",
    maxHeight: "none",
    padding: theme.spacing(2.5),
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5, 4),
  borderTop: "1px solid #e0e0e0",
  background: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2, 2),
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
  },
}));

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: "#e0e0e0",
    borderTopWidth: 2,
  },
  "&.Mui-active .MuiStepConnector-line": {
    borderColor: "#667eea",
  },
  "&.Mui-completed .MuiStepConnector-line": {
    borderColor: "#667eea",
  },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    color: "#9e9e9e",
    fontWeight: 500,
  },
  "& .MuiStepLabel-label.Mui-active": {
    color: "#667eea",
    fontWeight: 600,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: "#667eea",
    fontWeight: 600,
  },
  "& .MuiStepIcon-root": {
    color: "#e0e0e0",
    fontSize: "2rem",
  },
  "& .MuiStepIcon-root.Mui-active": {
    color: "#667eea",
  },
  "& .MuiStepIcon-root.Mui-completed": {
    color: "#667eea",
  },
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: "white",
  marginBottom: theme.spacing(2),
  border: "1px solid #e0e0e0",
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#2c3e50",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  [theme.breakpoints.down("md")]: {
    fontSize: "1.25rem",
    marginBottom: theme.spacing(1.5),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.125rem",
    marginBottom: theme.spacing(1.5),
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  fontWeight: "bold",
  marginRight: theme.spacing(1),
}));

const InfoBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#e8f5e9",
  border: "1px solid #c8e6c9",
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

function CalendarMeeting({
  selectedDate,
  clickedCalendarDate,
  existingMeeting = null,
  isEditing = false,
  onClose,
  onSave,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { createEvent, updateEvent, loading, error, clearError, events } =
    useCalendar();

  const [currentStep, setCurrentStep] = useState(0);
  const [bulkInviteOpen, setBulkInviteOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Enhanced loading and progress states
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [participantStats, setParticipantStats] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    title: "",
    message: "",
    severity: "error",
    details: null,
  });

  // FIXED: Initial form state with better defaults
  const getInitialFormState = () => ({
    selectedDate: new Date(),
    meetingTitle: "",
    meetingDuration: 60,
    startTime: "09:00",
    endTime: "10:00",
    participants: [],
    participantEmail: "",
    location: "",
    timeZone: "Asia/Kolkata",
    meetingSettings: {
      createCalendarEvent: true,
      sendInvitations: true,
      setReminders: true,
      addMeetingLink: true,
    },
    calendarSettings: {
      addToHostCalendar: true,
      addToParticipantCalendars: true,
      reminderTimes: [15, 30],
    },
  });

  const [formData, setFormData] = useState(getInitialFormState);

  const steps = useMemo(() => {
    return ["SELECT TIME", "MEETING DETAILS", "REVIEW & CREATE"];
  }, []);

  const durationOptions = useMemo(
    () => [
      { value: 15, label: "15 minutes" },
      { value: 30, label: "30 minutes" },
      { value: 45, label: "45 minutes" },
      { value: 60, label: "1 hour" },
      { value: 90, label: "1.5 hours" },
      { value: 120, label: "2 hours" },
    ],
    []
  );

  // ENHANCED: Utility function to safely parse dates with multiple formats
  const safeParseDateString = (dateString) => {
    if (!dateString) return null;

    try {
      // Handle different date formats
      let parsed;

      // ISO string format
      if (typeof dateString === "string" && dateString.includes("T")) {
        parsed = parseISO(dateString);
        if (isValid(parsed)) return parsed;
      }

      // Regular Date constructor
      parsed = new Date(dateString);
      if (isValid(parsed)) return parsed;

      return null;
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return null;
    }
  };

  // CRITICAL FIX: Get the correct meeting data from the events array
  const getCorrectMeetingData = useCallback(() => {
    if (!isEditing || !existingMeeting) return null;

    const meetingId =
      existingMeeting.id ||
      existingMeeting.ID ||
      existingMeeting.meeting_id ||
      existingMeeting.Meeting_ID;

    if (!meetingId) {
      console.log("⚠️ No meeting ID found");
      return existingMeeting;
    }

    console.log("🔍 Looking for meeting:", meetingId);

    if (events && Array.isArray(events) && events.length > 0) {
      const correctMeeting = events.find((event) => {
        const eventId = String(
          event.id || event.ID || event.meeting_id || event.Meeting_ID
        ).trim();
        const targetId = String(meetingId).trim();
        return eventId === targetId;
      });

      if (correctMeeting) {
        console.log("✅ Found in events array:", correctMeeting);
        return correctMeeting;
      }
    }

    if (
      existingMeeting &&
      (existingMeeting.title ||
        existingMeeting.Meeting_Name ||
        existingMeeting.start_time ||
        existingMeeting.Started_At)
    ) {
      console.log(
        "✅ Using existingMeeting prop (fresh from parent):",
        existingMeeting
      );
      return existingMeeting;
    }

    console.log("⚠️ Using fallback existingMeeting:", existingMeeting);
    return existingMeeting;
  }, [isEditing, existingMeeting, events]);

  // CRITICAL FIX: Enhanced email parsing function that handles all backend formats
  const parseEmailList = (emailData) => {
    if (!emailData) return [];

    try {
      console.log("🔍 DEBUG: Parsing email data:", {
        emailData,
        type: typeof emailData,
        isArray: Array.isArray(emailData),
        length: emailData?.length,
      });

      // If it's already an array
      if (Array.isArray(emailData)) {
        const validEmails = emailData
          .filter((email) => {
            if (
              typeof email === "string" &&
              email.trim() &&
              email.includes("@")
            ) {
              return true;
            }
            if (
              typeof email === "object" &&
              email?.email &&
              email.email.includes("@")
            ) {
              return true;
            }
            return false;
          })
          .map((email) => {
            if (typeof email === "string") return email.trim();
            if (typeof email === "object" && email.email)
              return email.email.trim();
            return null;
          })
          .filter(Boolean);

        console.log("📧 Parsed emails from array:", validEmails);
        return validEmails;
      }

      // If it's a string (most common from backend)
      if (typeof emailData === "string" && emailData.trim()) {
        // First try to parse as JSON (in case it's a JSON string)
        try {
          const parsed = JSON.parse(emailData);
          if (Array.isArray(parsed)) {
            const validEmails = parsed.filter(
              (email) =>
                email &&
                typeof email === "string" &&
                email.trim() &&
                email.includes("@")
            );
            console.log("📧 Parsed emails from JSON string:", validEmails);
            return validEmails;
          }
        } catch (jsonError) {
          // Not JSON, treat as comma/semicolon separated string
          const emails = emailData
            .split(/[,;]/) // Split by comma or semicolon
            .map((email) => email.trim())
            .filter((email) => email && email.includes("@"));

          console.log("📧 Parsed emails from delimited string:", emails);
          return emails;
        }
      }

      // CRITICAL: Handle number type (which we see in your logs)
      if (typeof emailData === "number") {
        console.log(
          "⚠️ DEBUG: Email data is a number, cannot extract emails:",
          emailData
        );
        return [];
      }

      console.log("📧 No valid emails found");
      return [];
    } catch (error) {
      console.error("❌ Error parsing email list:", emailData, error);
      return [];
    }
  };

  // ENHANCED: Calculate duration from start and end times
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 60;

    try {
      const start = safeParseDateString(startTime);
      const end = safeParseDateString(endTime);

      if (start && end) {
        return Math.max(15, Math.round((end - start) / (1000 * 60))); // Minimum 15 minutes
      }

      return 60; // Default
    } catch (error) {
      console.error("Error calculating duration:", error);
      return 60;
    }
  };

  // CRITICAL FIX: Enhanced data population effect for editing with comprehensive email handling
  useEffect(() => {
    if (isEditing && existingMeeting && !dataLoaded) {
      console.log(
        "🔧 DEBUG: Populating form with existing meeting data:",
        existingMeeting
      );

      try {
        // CRITICAL FIX: Get the correct meeting data
        const correctMeeting = getCorrectMeetingData();
        const meetingToUse = correctMeeting || existingMeeting;

        console.log(
          "🔧 DEBUG: Using meeting data for population:",
          meetingToUse
        );

        // Parse dates
        const startTime = safeParseDateString(
          meetingToUse.startTime ||
            meetingToUse.Started_At ||
            meetingToUse.start_time
        );
        const endTime = safeParseDateString(
          meetingToUse.endTime || meetingToUse.Ended_At || meetingToUse.end_time
        );

        console.log(
          "📅 DEBUG: Parsed dates - Start:",
          startTime,
          "End:",
          endTime
        );

        // Calculate duration
        const duration =
          meetingToUse.duration ||
          meetingToUse.meetingDuration ||
          meetingToUse.Duration_Minutes ||
          calculateDuration(startTime, endTime) ||
          60;

        // CRITICAL FIX: Comprehensive email extraction with all possible sources
        let emailList = [];

        // CRITICAL FIX: Use the correct meeting data for email extraction
        const emailSources = [
          { key: "participantEmails", value: meetingToUse.participantEmails }, // ✅ add this first
          { key: "attendees", value: meetingToUse.attendees },
          { key: "guest_emails", value: meetingToUse.guest_emails },
          { key: "participants", value: meetingToUse.participants },
          { key: "guestEmails", value: meetingToUse.guestEmails },
          { key: "attendee_emails", value: meetingToUse.attendee_emails },
          { key: "Participants", value: meetingToUse.Participants },
          { key: "guestEmailsRaw", value: meetingToUse.guestEmailsRaw },
          { key: "attendeesRaw", value: meetingToUse.attendeesRaw },
        ];

        console.log(
          "🔍 DEBUG: All available email sources from correct meeting:"
        );
        emailSources.forEach((source) => {
          console.log(
            `  ${source.key}:`,
            source.value,
            `(type: ${typeof source.value})`
          );
        });

        // Try each source until we find valid emails
        for (const source of emailSources) {
          if (source.value !== undefined && source.value !== null) {
            console.log(
              `🔍 DEBUG: Trying source "${source.key}":`,
              source.value
            );

            const parsedEmails = parseEmailList(source.value);
            if (parsedEmails && parsedEmails.length > 0) {
              emailList = parsedEmails;
              console.log(
                `✅ SUCCESS: Found ${parsedEmails.length} emails from "${source.key}":`,
                parsedEmails
              );
              break;
            }
          }
        }

        // If no emails found from structured sources, try to find any email-like strings in the object
        if (emailList.length === 0) {
          console.log(
            "⚠️ DEBUG: No emails found in structured fields, scanning entire object..."
          );

          const objectStr = JSON.stringify(meetingToUse);
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const foundEmails = objectStr.match(emailRegex);

          if (foundEmails) {
            emailList = [...new Set(foundEmails)]; // Remove duplicates
            console.log(`✅ SUCCESS: Found emails via regex scan:`, emailList);
          }
        }

        // Convert emails to participant objects
        const participants = emailList.map((email, index) => ({
          id: Date.now() + index + Math.random(), // Ensure unique IDs
          email: email.trim(),
          name: email.split("@")[0],
        }));

        console.log("👥 DEBUG: Final participants created:", participants);
        console.log("📊 DEBUG: Participant count:", participants.length);

        // ENHANCED: Extract settings with proper fallbacks
        const meetingSettings = {
          createCalendarEvent:
            meetingToUse.Settings_CreateCalendarEvent ??
            meetingToUse.Settings?.createCalendarEvent ??
            true,
          sendInvitations:
            meetingToUse.Settings_SendInvitations ??
            meetingToUse.Settings?.sendInvitations ??
            true,
          setReminders:
            meetingToUse.Settings_SetReminders ??
            meetingToUse.Settings?.setReminders ??
            true,
          addMeetingLink:
            meetingToUse.Settings_AddMeetingLink ??
            meetingToUse.Settings?.addMeetingLink ??
            true,
        };

        // Parse reminder minutes with multiple fallbacks
        let reminderTimes = [15, 30]; // Default
        const reminderSources = [
          meetingToUse.reminderMinutes,
          meetingToUse.ReminderMinutes,
          meetingToUse.CalendarSettings?.reminderTimes,
          meetingToUse.calendarSettings?.reminderTimes,
        ];

        for (const source of reminderSources) {
          if (source) {
            try {
              if (Array.isArray(source)) {
                reminderTimes = source;
                break;
              } else if (typeof source === "string") {
                const parsed = JSON.parse(source);
                if (Array.isArray(parsed)) {
                  reminderTimes = parsed;
                  break;
                }
              } else if (typeof source === "number") {
                reminderTimes = [source];
                break;
              }
            } catch (error) {
              console.warn("Error parsing reminder source:", source, error);
            }
          }
        }

        const calendarSettings = {
          addToHostCalendar:
            meetingToUse.Settings_AddToHostCalendar ??
            meetingToUse.CalendarSettings?.addToHostCalendar ??
            true,
          addToParticipantCalendars:
            meetingToUse.Settings_AddToParticipantCalendars ??
            meetingToUse.CalendarSettings?.addToParticipantCalendars ??
            true,
          reminderTimes: reminderTimes,
        };

        // ENHANCED: Comprehensive form data population
        const populatedData = {
          selectedDate: startTime || new Date(),
          meetingTitle:
            meetingToUse.title ||
            meetingToUse.Meeting_Name ||
            meetingToUse.meetingTitle ||
            "",
          meetingDuration: duration,
          startTime: startTime ? format(startTime, "HH:mm") : "09:00",
          endTime: endTime ? format(endTime, "HH:mm") : "10:00",
          participants: participants, // This is the critical fix!
          participantEmail: "",
          location: meetingToUse.location || meetingToUse.Location || "",
          timeZone:
            meetingToUse.timezone || meetingToUse.timeZone || "Asia/Kolkata",
          meetingSettings: meetingSettings,
          calendarSettings: calendarSettings,
        };

        console.log("📝 DEBUG: Final populated form data:", populatedData);
        console.log(
          "📊 DEBUG: Final participant count in form:",
          populatedData.participants.length
        );

        setFormData(populatedData);
        setDataLoaded(true);

        // Additional debug info
        if (process.env.NODE_ENV === "development") {
          console.log("🐛 DEVELOPMENT DEBUG INFO:");
          console.log("Original meeting object:", existingMeeting);
          console.log("Correct meeting object:", correctMeeting);
          console.log("Meeting used for population:", meetingToUse);
          console.log("Extracted email list:", emailList);
          console.log("Created participants:", participants);
          console.log("Form data set:", populatedData);
        }
      } catch (error) {
        console.error("❌ Error populating form data:", error);
        console.error("❌ Error details:", {
          error: error.message,
          stack: error.stack,
          meetingData: existingMeeting,
        });

        // Fallback with minimal data but still try to get participants
        let fallbackParticipants = [];
        try {
          // Last resort: try to find any emails anywhere in the meeting object
          const meetingStr = JSON.stringify(existingMeeting);
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const foundEmails = meetingStr.match(emailRegex);
          if (foundEmails) {
            fallbackParticipants = [...new Set(foundEmails)].map(
              (email, index) => ({
                id: Date.now() + index,
                email: email,
                name: email.split("@")[0],
              })
            );
            console.log(
              "🔧 Fallback: Found participants via regex:",
              fallbackParticipants
            );
          }
        } catch (fallbackError) {
          console.error(
            "❌ Even fallback email extraction failed:",
            fallbackError
          );
        }

        const fallbackData = {
          ...getInitialFormState(),
          meetingTitle:
            existingMeeting.title ||
            existingMeeting.Meeting_Name ||
            "Untitled Meeting",
          location: existingMeeting.location || "",
          meetingDuration: existingMeeting.duration || 60,
          participants: fallbackParticipants, // Include any emails we found
        };

        setFormData(fallbackData);
        setDataLoaded(true);
      }
    }
  }, [isEditing, existingMeeting, dataLoaded, getCorrectMeetingData]);

  // Handle clicked calendar date population (for new meetings)
  useEffect(() => {
    if (!isEditing && clickedCalendarDate && !dataLoaded) {
      console.log("📅 Setting clicked calendar date:", clickedCalendarDate);

      const dateToSet = new Date(clickedCalendarDate);
      setFormData((prev) => ({
        ...prev,
        selectedDate: dateToSet,
      }));
      setDataLoaded(true);
    } else if (!isEditing && !clickedCalendarDate && !dataLoaded) {
      // For manual "New Meeting" clicks, just mark as loaded
      setDataLoaded(true);
    }
  }, [clickedCalendarDate, isEditing, dataLoaded]);

  // Calculate end time when start time or duration changes
  useEffect(() => {
    if (formData.startTime && formData.meetingDuration) {
      try {
        const [hours, minutes] = formData.startTime.split(":");
        const startDate = new Date();
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endDate = new Date(
          startDate.getTime() + formData.meetingDuration * 60000
        );
        const endTime = format(endDate, "HH:mm");

        setFormData((prev) => ({
          ...prev,
          endTime: endTime,
        }));
      } catch (error) {
        console.error("Error calculating end time:", error);
      }
    }
  }, [formData.startTime, formData.meetingDuration]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.selectedDate) {
      errors.selectedDate = "Please select a date";
    }

    if (!formData.startTime) {
      errors.startTime = "Please select a start time";
    }

    if (!formData.meetingTitle || formData.meetingTitle.trim() === "") {
      errors.meetingTitle = "Meeting title is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.selectedDate, formData.startTime, formData.meetingTitle]);

  // Add participant - Enhanced to handle multiple comma-separated emails
  const addParticipant = useCallback(() => {
    if (!formData.participantEmail) {
      return;
    }

    // Parse comma-separated emails
    const emailList = formData.participantEmail
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      return;
    }

    // Validate each email
    const invalidEmails = emailList.filter((email) => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      console.warn("Invalid email addresses:", invalidEmails.join(", "));
      return;
    }

    // Check for existing emails
    const existingEmails = emailList.filter((email) =>
      formData.participants.some(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      )
    );

    if (existingEmails.length > 0) {
      console.warn(
        "These emails are already in the participant list:",
        existingEmails.join(", ")
      );
      return;
    }

    // Create new participants for all valid emails
    const newParticipants = emailList.map((email, index) => ({
      id: Date.now() + index + Math.random(), // Ensure unique IDs
      email: email,
      name: email.split("@")[0],
    }));

    // Add all participants at once
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, ...newParticipants],
      participantEmail: "",
    }));
  }, [formData.participantEmail, formData.participants]);

  // Remove participant
  const removeParticipant = useCallback((id) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== id),
    }));
  }, []);

  // Email validation
  const isValidEmail = useCallback((email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, []);

  // Bulk invite handler
  const handleBulkInvitesSent = useCallback((bulkEmails) => {
    const newParticipants = bulkEmails.map((email, index) => ({
      id: Date.now() + index + Math.random(),
      email: email,
      name: email.split("@")[0],
    }));

    setFormData((prev) => {
      const existingEmails = new Set(
        prev.participants.map((p) => p.email.toLowerCase())
      );
      const uniqueNewParticipants = newParticipants.filter(
        (p) => !existingEmails.has(p.email.toLowerCase())
      );

      return {
        ...prev,
        participants: [...prev.participants, ...uniqueNewParticipants],
      };
    });

    setBulkInviteOpen(false);
  }, []);

  const showErrorDialog = (title, message, severity = "error", details = null) => {
    setErrorDialog({
      open: true,
      title,
      message,
      severity,
      details,
    });
  };

  const closeErrorDialog = () => {
    const wasError =
      errorDialog.severity === "error" || errorDialog.severity === "warning";

    setErrorDialog({
      open: false,
      title: "",
      message: "",
      severity: "error",
      details: null,
    });

    // Only navigate back on errors, keep form open on success
    if (wasError) {
      if (onClose) {
        onClose();
      } else {
        navigate("/calendar");
      }
    }
  };

  // Handle form submission with progress tracking
  const handleCreateMeeting = useCallback(async () => {
    if (isCreating) {
      console.log("Meeting creation/update already in progress...");
      return;
    }
    if (!validateForm()) {
      setCurrentStep(0);
      return;
    }

    setIsCreating(true);
    setCreationProgress(0);
    setProgressMessage("Preparing meeting data...");
    setParticipantStats(null);

    try {
      const participantEmails = formData.participants.map((p) => p.email);

      const selectedDate = new Date(formData.selectedDate);
      const [startHours, startMinutes] = formData.startTime.split(":");
      const [endHours, endMinutes] = formData.endTime.split(":");

      const userSelectedStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(startHours),
        parseInt(startMinutes),
        0,
        0
      );

      const userSelectedEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(endHours),
        parseInt(endMinutes),
        0,
        0
      );

      // ✅ KEY FIX: Only convert times for NEW meetings
      let istStartString, istEndString;

      if (isEditing && existingMeeting) {
        // 📝 EDIT MODE: Use original times (no conversion)
        console.log("📝 EDIT MODE: Using original meeting times");
        istStartString =
          existingMeeting.start_time ||
          existingMeeting.startTime ||
          existingMeeting.Started_At;
        istEndString =
          existingMeeting.end_time ||
          existingMeeting.endTime ||
          existingMeeting.Ended_At;
        console.log("  Using original:", { istStartString, istEndString });
      } else {
        // ✨ CREATE MODE: Convert local times to ISO
        console.log("✨ CREATE MODE: Converting local times to ISO");
        istStartString = userSelectedStart.toISOString();
        istEndString = userSelectedEnd.toISOString();
        console.log("  Converted to ISO:", { istStartString, istEndString });
      }

      const meetingData = {
        title: formData.meetingTitle,
        Meeting_Name: formData.meetingTitle,
        Meeting_Type: "CalendarMeeting",

        // ✅ TIME FIELDS - Using corrected start/end times
        start_time: istStartString, // ✅ Uses original OR converted correctly
        end_time: istEndString, // ✅ Uses original OR converted correctly
        startTime: istStartString, // Alternative field
        endTime: istEndString, // Alternative field
        Started_At: istStartString, // Alternative field
        Ended_At: istEndString, // Alternative field

        duration_minutes: formData.meetingDuration,
        location: formData.location,

        // Participant fields (all variations)
        guestEmails: participantEmails,
        attendees: participantEmails,
        participantEmails: participantEmails,
        guest_emails: participantEmails,

        Participants: formData.participants.map((p) => ({
          email: p.email,
          name: p.name || p.email.split("@")[0],
        })),

        provider: "internal",

        Settings: {
          createCalendarEvent: formData.meetingSettings.createCalendarEvent,
          sendInvitations: formData.meetingSettings.sendInvitations,
          setReminders: formData.meetingSettings.setReminders,
          addMeetingLink: formData.meetingSettings.addMeetingLink,
          recording: true,
        },

        CalendarSettings: {
          addToHostCalendar: formData.calendarSettings.addToHostCalendar,
          addToParticipantCalendars:
            formData.calendarSettings.addToParticipantCalendars,
          reminderTimes: formData.calendarSettings.reminderTimes,
        },

        Status: "scheduled",
        Is_Recording_Enabled: true,
        Waiting_Room_Enabled: false,
        ReminderMinutes: formData.calendarSettings.reminderTimes,
        reminderMinutes: formData.calendarSettings.reminderTimes,
      };

      console.log("📤 Meeting data prepared:", meetingData);
      console.log("   start_time:", meetingData.start_time);
      console.log("   end_time:", meetingData.end_time);

      let result;

      if (isEditing && existingMeeting) {
        const meetingId =
          existingMeeting.ID ||
          existingMeeting.id ||
          existingMeeting.meeting_id;

        if (!meetingId) {
          throw new Error("No meeting ID found for update");
        }

        // ✅ FIX: Preserve original times if not changed
        const updateData = {
          ...meetingData,
          start_time:
            meetingData.start_time ||
            existingMeeting.start_time ||
            existingMeeting.startTime,
          end_time:
            meetingData.end_time ||
            existingMeeting.end_time ||
            existingMeeting.endTime,
          id: meetingId,
          meeting_id: meetingId,
          Meeting_ID: meetingId,
        };

        console.log(
          "🔄 Updating meeting with participants:",
          participantEmails
        );
        console.log("   Original times:", {
          original_start: existingMeeting.start_time,
          original_end: existingMeeting.end_time,
          sending_start: updateData.start_time,
          sending_end: updateData.end_time,
        });
        result = await updateEvent(meetingId, updateData);
      } else {
        console.log("🆕 Creating new meeting with participants:", participantEmails);

        result = await createEvent(meetingData, (progress, message) => {
          setCreationProgress(progress);
          setProgressMessage(message);
        });

        console.log("📥 Create event result:", result);
      }
      // ✅ Check for backend errors
      if (!result.success && result.error) {
        console.error("❌ Backend returned error:", result.error);

        showErrorDialog(
          result.error.title || "Error",
          result.error.message || "Failed to create meeting",
          result.error.severity || "error",
          result.error.details
        );

        setCreationProgress(0);
        setProgressMessage("");
        return; // Stop execution
      }

      if (result.success) {
        if (result.participantSummary) {
          setParticipantStats(result.participantSummary);
        }

        setCreationProgress(100);
        setProgressMessage("Meeting processed successfully!");
        showErrorDialog(
          "✅ Success!",
          isEditing
            ? "Meeting updated successfully!"
            : "Meeting created successfully!",
          "success"
        );
        console.log("✅ Meeting processing complete");

        setTimeout(() => {
          if (onSave) {
            console.log("📞 Calling onSave callback");
            onSave(result.event || meetingData);
          }

          if (onClose) {
            console.log("🛑 Calling onClose");
            onClose();
          } else {
            console.log("🗺️ Navigating to dashboard");
            navigate("/dashboard", {
              state: {
                message: isEditing
                  ? "Meeting updated successfully!"
                  : "Calendar meeting created successfully!",
                meetingLink: result.meetingLink,
                participantSummary: result.participantSummary,
                calendarIntegration: result.calendarIntegration,
              },
            });
          }
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to process meeting");
      }
    } catch (error) {
      console.error("❌ Failed to process calendar meeting:", error);

      // Parse error message
      let errorMessage = "Failed to save meeting. Please try again.";
      let errorDetails = null;

      if (error.response) {
        const { status, data } = error.response;

        if (data?.Error || data?.error || data?.message) {
          errorMessage = data.Error || data.error || data.message;
        }

        // Handle specific error codes
        if (status === 400) {
          if (errorMessage.includes("already have a scheduled meeting")) {
            showErrorDialog(
              "Time Conflict",
              "You already have a meeting scheduled at this time. Please choose a different time slot.",
              "warning",
              errorMessage
            );
            setCreationProgress(0);
            setProgressMessage("");
            return;
          } else if (
            errorMessage.includes("Invalid") ||
            errorMessage.includes("required")
          ) {
            showErrorDialog("Invalid Data", errorMessage, "warning");
            setCreationProgress(0);
            setProgressMessage("");
            return;
          }
        } else if (status === 401) {
          showErrorDialog(
            "Authentication Required",
            "Your session has expired. Please log in again.",
            "error"
          );
          setCreationProgress(0);
          setProgressMessage("");
          return;
        } else if (status === 500) {
          errorDetails = "Server encountered an internal error.";
        }
      } else if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showErrorDialog(
        "Error Saving Meeting",
        errorMessage,
        "error",
        errorDetails
      );

      setCreationProgress(0);
      setProgressMessage("");
    } finally {
      if (creationProgress !== 100) {
        setIsCreating(false);
      }
    }
  }, [
    formData,
    validateForm,
    isEditing,
    existingMeeting,
    createEvent,
    updateEvent,
    onSave,
    onClose,
    navigate,
    creationProgress,
  ]);

  // Update form data handlers
  const updateFormData = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateMeetingSettings = useCallback((settingUpdates) => {
    setFormData((prev) => ({
      ...prev,
      meetingSettings: {
        ...prev.meetingSettings,
        ...settingUpdates,
      },
    }));
  }, []);

  const updateCalendarSettings = useCallback((settingUpdates) => {
    setFormData((prev) => ({
      ...prev,
      calendarSettings: {
        ...prev.calendarSettings,
        ...settingUpdates,
      },
    }));
  }, []);

  const clearValidationError = useCallback((fieldName) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // ===== NEW UI RENDERING FUNCTIONS =====

  // Render Meeting Summary (Right Panel)
  const renderMeetingSummary = () => (
    <SummaryPanel>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ 
          color: "#2c3e50", 
          mb: 3,
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
        }}
      >
        Meeting Summary
      </Typography>

      <SummaryCard elevation={0}>
        <SummaryItem>
          <Event sx={{ color: "#5568d3", fontSize: 24 }} />
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: "#2c3e50" }}>
              {formData.selectedDate
                ? format(formData.selectedDate, "EEEE, MMMM dd, yyyy")
                : "Not selected"}
            </Typography>
          </Box>
        </SummaryItem>

        <Divider sx={{ my: 2 }} />

        <SummaryItem>
          <AccessTime sx={{ color: "#5568d3", fontSize: 24 }} />
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: "#2c3e50" }}>
              {formData.startTime && formData.endTime
                ? `${format(
                    new Date(`2000-01-01T${formData.startTime}`),
                    "h:mm a"
                  )} - ${format(
                    new Date(`2000-01-01T${formData.endTime}`),
                    "h:mm a"
                  )}`
                : "9:00 AM - 10:00 AM"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.meetingDuration} minutes duration
            </Typography>
          </Box>
        </SummaryItem>

        <Divider sx={{ my: 2 }} />

        <SummaryItem>
          <Group sx={{ color: "#5568d3", fontSize: 24 }} />
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: "#2c3e50" }}>
              {formData.participants.length} Participants
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formData.participants.length === 0
                ? "No participants added"
                : "Invitations will be sent"}
            </Typography>
          </Box>
        </SummaryItem>

        <Divider sx={{ my: 2 }} />

        <SummaryItem>
          <Language sx={{ color: "#5568d3", fontSize: 24 }} />
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ color: "#2c3e50" }}>
              {formData.timeZone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Timezone
            </Typography>
          </Box>
        </SummaryItem>
      </SummaryCard>

      {formData.selectedDate && formData.startTime && (
        <InfoBox elevation={0}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircle sx={{ color: "#4caf50", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={600} color="#2e7d32">
              Meeting scheduled for:
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {format(formData.selectedDate, "EEEE, MMMM dd, yyyy")} at{" "}
            {format(new Date(`2000-01-01T${formData.startTime}`), "h:mm a")} (
            {formData.meetingDuration} minutes)
          </Typography>
        </InfoBox>
      )}
    </SummaryPanel>
  );

  // Step 1: Date & Time
  const renderSelectTime = () => (
    <MainContent>
      <SectionTitle>
        <StepNumber>1</StepNumber>
        Date & Time
      </SectionTitle>

      <Box sx={{ maxWidth: "600px" }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Meeting Date *
          </Typography>
          <TextField
            fullWidth
            type="date"
            value={
              formData.selectedDate
                ? format(formData.selectedDate, "yyyy-MM-dd")
                : ""
            }
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              updateFormData({ selectedDate: newDate });
              clearValidationError("selectedDate");
            }}
            error={!!validationErrors.selectedDate}
            helperText={validationErrors.selectedDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Start Time *
          </Typography>
          <TextField
            fullWidth
            type="time"
            value={formData.startTime}
            onChange={(e) => {
              updateFormData({ startTime: e.target.value });
              clearValidationError("startTime");
            }}
            error={!!validationErrors.startTime}
            helperText={validationErrors.startTime}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: "white",
                borderRadius: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Duration
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.meetingDuration}
              onChange={(e) =>
                updateFormData({ meetingDuration: e.target.value })
              }
              sx={{
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              {durationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Timezone
          </Typography>
          <FormControl fullWidth>
            <Select
              value={formData.timeZone}
              onChange={(e) => updateFormData({ timeZone: e.target.value })}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
              }}
            >
              <MenuItem value="Asia/Kolkata">Asia/Kolkata</MenuItem>
              <MenuItem value="America/New_York">America/New_York</MenuItem>
              <MenuItem value="Europe/London">Europe/London</MenuItem>
              <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </MainContent>
  );

  // Step 2: Meeting Details
  const renderMeetingDetails = () => (
    <MainContent>
      <SectionTitle>
        <StepNumber>2</StepNumber>
        Meeting Details
      </SectionTitle>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          fontWeight={500}
          sx={{ mb: 1 }}
        >
          Meeting Title *
        </Typography>
        <TextField
          fullWidth
          value={formData.meetingTitle}
          onChange={(e) => {
            updateFormData({ meetingTitle: e.target.value });
            clearValidationError("meetingTitle");
          }}
          placeholder="Enter meeting title..."
          required
          error={!!validationErrors.meetingTitle}
          helperText={
            validationErrors.meetingTitle ||
            "Enter a descriptive title for your meeting"
          }
          sx={{
            "& .MuiInputBase-root": {
              bgcolor: "white",
              borderRadius: 1,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          fontWeight={500}
          sx={{ mb: 1 }}
        >
          Location (Optional)
        </Typography>
        <TextField
          fullWidth
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder="Enter meeting location or 'Online'..."
          helperText="Physical location or 'Online' for virtual meetings"
          sx={{
            "& .MuiInputBase-root": {
              bgcolor: "white",
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Participants section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Participants ({formData.participants.length})
          </Typography>
          <Button
            variant="outlined"
            startIcon={<GroupAdd />}
            onClick={() => setBulkInviteOpen(true)}
            size="small"
            sx={{
              textTransform: "none",
              borderColor: "#667eea",
              color: "#667eea",
              "&:hover": {
                borderColor: "#5568d3",
                backgroundColor: "rgba(102, 126, 234, 0.04)",
              },
            }}
          >
            Bulk Invite
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              value={formData.participantEmail}
              onChange={(e) => {
                updateFormData({ participantEmail: e.target.value });
              }}
              placeholder="user1@example.com, user2@example.com"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addParticipant();
                }
              }}
              helperText="Enter multiple emails separated by commas"
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={addParticipant}
              disabled={!formData.participantEmail}
              sx={{
                height: { xs: 48, md: 56 },
                textTransform: "none",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
              }}
            >
              {formData.participantEmail?.includes(",") ? "Add All" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Participants list */}
      {formData.participants.length > 0 && (
        <Paper
          sx={{
            maxHeight: 200,
            overflow: "auto",
            bgcolor: "#f8f9fa",
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <List>
            {formData.participants.map((participant, index) => (
              <ListItem
                key={participant.id}
                divider={index < formData.participants.length - 1}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      bgcolor: "#667eea",
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    {participant.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {participant.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {participant.email}
                    </Typography>
                  }
                />
                <IconButton
                  onClick={() => removeParticipant(participant.id)}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {formData.participants.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            No participants added yet. Add participant emails above or use the
            Bulk Invite feature.
          </Typography>
        </Alert>
      )}

      {/* Meeting Settings Accordion */}
      <Accordion sx={{ mt: 3, bgcolor: "#f8f9fa" }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Meeting Settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.meetingSettings.createCalendarEvent}
                  onChange={(e) =>
                    updateMeetingSettings({
                      createCalendarEvent: e.target.checked,
                    })
                  }
                />
              }
              label="Create calendar event"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.meetingSettings.sendInvitations}
                  onChange={(e) =>
                    updateMeetingSettings({ sendInvitations: e.target.checked })
                  }
                />
              }
              label="Send email invitations"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.meetingSettings.setReminders}
                  onChange={(e) =>
                    updateMeetingSettings({ setReminders: e.target.checked })
                  }
                />
              }
              label="Set calendar reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.meetingSettings.addMeetingLink}
                  onChange={(e) =>
                    updateMeetingSettings({ addMeetingLink: e.target.checked })
                  }
                />
              }
              label="Add video meeting link"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </MainContent>
  );

  // Step 3: Review & Create
  const renderReview = () => (
    <MainContent>
      <SectionTitle>
        <StepNumber>3</StepNumber>
        {isEditing ? "Review Changes" : "Review & Create"}
      </SectionTitle>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              color="primary"
              fontWeight={700}
              gutterBottom
              display="block"
            >
              MEETING DETAILS
            </Typography>
            <Typography 
              variant="h6" 
              gutterBottom 
              fontWeight={600}
              sx={{
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
              }}
            >
              {formData.meetingTitle || "Untitled Meeting"}
            </Typography>
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Event fontSize="small" color="action" />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                >
                  {formData.selectedDate?.toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTime fontSize="small" color="action" />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                >
                  {formData.startTime && formData.endTime
                    ? `${format(
                        new Date(`2000-01-01T${formData.startTime}`),
                        "h:mm a"
                      )} - ${format(
                        new Date(`2000-01-01T${formData.endTime}`),
                        "h:mm a"
                      )}`
                    : "No time selected"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule fontSize="small" color="action" />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                >
                  {formData.meetingDuration} minutes
                </Typography>
              </Box>
              {formData.location && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                  >
                    {formData.location}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "#f8f9fa",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              color="primary"
              fontWeight={700}
              gutterBottom
              display="block"
            >
              PARTICIPANTS ({formData.participants.length})
            </Typography>
            {formData.participants.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {formData.participants.length <= 5 ? (
                  formData.participants.map((participant) => (
                    <Typography
                      key={participant.id}
                      variant="body2"
                      gutterBottom
                      sx={{ 
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {participant.name} ({participant.email})
                    </Typography>
                  ))
                ) : (
                  <Box>
                    {formData.participants.slice(0, 3).map((participant) => (
                      <Typography
                        key={participant.id}
                        variant="body2"
                        gutterBottom
                        sx={{ 
                          fontSize: { xs: "0.875rem", sm: "0.875rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {participant.name} ({participant.email})
                      </Typography>
                    ))}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        fontStyle: "italic", 
                        mt: 1,
                        fontSize: { xs: "0.875rem", sm: "0.875rem" },
                      }}
                    >
                      ... and {formData.participants.length - 3} more
                      participants
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 2,
                  fontSize: { xs: "0.875rem", sm: "0.875rem" },
                }}
              >
                No participants added
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: alpha("#667eea", 0.05),
              border: `1px solid ${alpha("#667eea", 0.2)}`,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              color="primary"
              fontWeight={700}
              gutterBottom
              display="block"
            >
              CALENDAR INTEGRATION
            </Typography>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ mt: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventAvailable
                  color={
                    formData.calendarSettings.addToHostCalendar
                      ? "primary"
                      : "disabled"
                  }
                  fontSize="small"
                />
                <Typography
                  variant="body2"
                  color={
                    formData.calendarSettings.addToHostCalendar
                      ? "text.primary"
                      : "text.secondary"
                  }
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                >
                  Host calendar:{" "}
                  {formData.calendarSettings.addToHostCalendar
                    ? "Enabled"
                    : "Disabled"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Group
                  color={
                    formData.calendarSettings.addToParticipantCalendars
                      ? "primary"
                      : "disabled"
                  }
                  fontSize="small"
                />
                <Typography
                  variant="body2"
                  color={
                    formData.calendarSettings.addToParticipantCalendars
                      ? "text.primary"
                      : "text.secondary"
                  }
                  sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                >
                  Participant calendars:{" "}
                  {formData.calendarSettings.addToParticipantCalendars
                    ? "Enabled"
                    : "Disabled"}
                </Typography>
              </Box>
            </Stack>

            {(formData.calendarSettings.addToHostCalendar ||
              formData.calendarSettings.addToParticipantCalendars) && (
              <Box sx={{ mt: 2 }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.75rem" } }}
                >
                  Reminders:{" "}
                  {formData.calendarSettings.reminderTimes.join(", ")} minutes
                  before
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Creation progress */}
      {isCreating && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            {progressMessage ||
              (isEditing ? "Updating meeting..." : "Creating meeting...")}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={creationProgress}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            {creationProgress}% complete
          </Typography>

          {participantStats && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Participant Summary:</strong>
                <br />
                {participantStats.added} of {participantStats.total}{" "}
                participants added successfully
                {participantStats.failed > 0 && (
                  <span>
                    <br />
                    {participantStats.failed} participants failed to add (you
                    can try adding them manually)
                  </span>
                )}
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
        </Alert>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Please fix the following issues:</strong>
          </Typography>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            {Object.values(validationErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
    </MainContent>
  );

  // Validation for proceeding to next step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0: // Select Time
        return formData.selectedDate && formData.startTime;
      case 1: // Meeting Details
        return formData.meetingTitle.trim() !== "";
      case 2: // Review
        return validateForm();
      default:
        return false;
    }
  }, [
    currentStep,
    formData.selectedDate,
    formData.startTime,
    formData.meetingTitle,
    validateForm,
  ]);

  const getNextButtonText = () => {
    if (!canProceed) {
      if (currentStep === 0 && (!formData.selectedDate || !formData.startTime)) {
        return "Select Date & Time First";
      }
      if (currentStep === 1 && !formData.meetingTitle.trim()) {
        return "Enter Meeting Title";
      }
      return "Complete Required Fields";
    }
    return "Next";
  };

  // Don't render until data is properly loaded for editing
  if (isEditing && !dataLoaded) {
    return (
      <StyledContainer>
        <ModernCard>
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Loading meeting data...</Typography>
          </CardContent>
        </ModernCard>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <ModernCard>
        {/* Header */}
        <HeaderSection>
          <Box
            sx={{
              display: "inline-flex",
              p: { xs: 1.5, sm: 2 },
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              mb: 2,
            }}
          >
            <CalendarToday 
              sx={{ 
                fontSize: { xs: 32, sm: 40, md: 48 }, 
                color: "white" 
              }} 
            />
          </Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            {isEditing ? "Edit Meeting" : "Calendar Meeting"}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              px: { xs: 2, sm: 0 },
            }}
          >
            {isEditing
              ? "Update your meeting details and calendar settings"
              : "Create a new calendar meeting with integration options"}
          </Typography>
        </HeaderSection>

        {/* Stepper */}
        <StepperSection>
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            connector={<StyledStepConnector />}
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label}>
                <StyledStepLabel
                  sx={{
                    "& .MuiStepLabel-labelContainer": {
                      display: { xs: "none", sm: "block" },
                    },
                  }}
                >
                  <Box 
                    sx={{ 
                      display: { xs: "none", sm: "block" } 
                    }}
                  >
                    {label}
                  </Box>
                  <Box 
                    sx={{ 
                      display: { xs: "block", sm: "none" },
                      fontSize: "0.625rem",
                      mt: 0.5,
                    }}
                  >
                    Step {index + 1}
                  </Box>
                </StyledStepLabel>
              </Step>
            ))}
          </Stepper>
        </StepperSection>

        {/* Content */}
        <ContentSection>
          {/* Main Content Area */}
          {currentStep === 0 && renderSelectTime()}
          {currentStep === 1 && renderMeetingDetails()}
          {currentStep === 2 && renderReview()}

          {/* Summary Panel */}
          {renderMeetingSummary()}
        </ContentSection>

        {/* Footer */}
        <FooterSection>
          <Box>
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              variant="text"
              startIcon={<ArrowBack />}
              sx={{ 
                textTransform: "none",
                color: "text.secondary",
                fontSize: "1rem",
                fontWeight: 400,
                "&:hover": {
                  bgcolor: "transparent",
                },
                "&.Mui-disabled": {
                  color: "text.disabled",
                },
              }}
            >
              Back
            </Button>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
              onClick={onClose || (() => navigate("/calendar"))}
              variant="text"
              sx={{ 
                textTransform: "none",
                color: "text.secondary",
                fontSize: "1rem",
                fontWeight: 400,
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed}
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  textTransform: "none",
                  minWidth: 120,
                  background: "#5568d3",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    background: "#4558c2",
                  },
                  "&.Mui-disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCreateMeeting}
                disabled={isCreating || loading || !canProceed}
                variant="contained"
                startIcon={
                  isCreating || loading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : null
                }
                sx={{
                  textTransform: "none",
                  minWidth: 160,
                  background: "#5568d3",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    background: "#4558c2",
                  },
                  "&.Mui-disabled": {
                    background: "#e0e0e0",
                    color: "#9e9e9e",
                  },
                }}
              >
                {isCreating || loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Meeting"
                  : "Create Meeting"}
              </Button>
            )}
          </Box>
        </FooterSection>
      </ModernCard>

      {/* Bulk Invite Dialog */}
      <BulkInvite
        open={bulkInviteOpen}
        onClose={() => setBulkInviteOpen(false)}
        meetingId={
          formData?.id || existingMeeting?.ID || "new-calendar-meeting"
        }
        meetingTitle={formData?.meetingTitle || "New Calendar Meeting"}
        onInvitesSent={handleBulkInvitesSent}
      />

      {/* Error Dialog */}
      <ErrorDialog
        open={errorDialog.open}
        onClose={closeErrorDialog}
        title={errorDialog.title}
        message={errorDialog.message}
        severity={errorDialog.severity}
        details={errorDialog.details}
      />
    </StyledContainer>
  );
}

export default CalendarMeeting;