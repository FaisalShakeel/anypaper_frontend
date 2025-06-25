import React from "react";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  IconButton 
} from "@mui/material";
import { 
  Gavel, 
  CheckCircle, 
  Policy, 
  Info, 
  ReportProblem 
} from "@mui/icons-material";
import NavBar from "./landingpage/navbar";
import Footer from "./landingpage/footer";
export const ConductGuidelines = () => {
  return (
    <>
    <NavBar/>
    <Container maxWidth="md" sx={{ my: 4, border: '2px solid #000', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Conduct Guidelines
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
        Date updated: February 18th, 2024
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Gavel color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Academic Integrity</Typography>
          </Box>
          <Typography>
            Academic integrity is a fundamental principle of ethical conduct in scholarly work. The following are strictly prohibited:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Copying others' work without permission" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Engaging in fraudulent activities" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fabricating information" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <CheckCircle color="success" sx={{ mr: 1 }} />
            <Typography variant="h6">User Responsibilities</Typography>
          </Box>
          <Typography>Users agree to:</Typography>
          <List>
            <ListItem>
              <ListItemText primary="Use the Website solely for personal, legitimate purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Refrain from unlawful activities" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not violate institutional honor codes" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Policy color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Fair Use Policy</Typography>
          </Box>
          <Typography>
            Products provided are for personal use only and should not be resold or misrepresented.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Compliance with Legal Requirements</Typography>
          </Box>
          <Typography>
            Users must comply with all relevant laws and Platform policies.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <ReportProblem color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">Prohibited Requests</Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText primary="Impersonation of another individual" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fabrication of information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Submitting assignments on behalf of users" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Rules of Conduct</Typography>
          <Typography>
            The Platform does not support academic dishonesty and will take action against fraudulent behavior.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Disclaimer</Typography>
          <Typography>
            We do not guarantee accuracy or specific results from the use of our materials.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Amendments</Typography>
          <Typography>
            These Guidelines may change without prior notice. Users must stay updated.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Contact Details</Typography>
          <Typography>
            If you have any questions, please contact us at:
          </Typography>
          <Typography color="primary" sx={{ mt: 1 }}>
            Email: <a href="mailto:xyz@gmail.com">xyz@gmail.com</a>
          </Typography>
        </CardContent>
      </Card>
    </Container>
    <Footer/>
    </>
  );
};

export const RefundPolicy = () => {
  return (
    <>
    <NavBar/>
    <Container maxWidth="md" sx={{ my: 4, border: '2px solid #000', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Refund Policy
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Refund Period</Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText primary="Orders under 20 pages: 14-day money-back period." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Orders over 20 pages: 30-day money-back period." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Confirmed plagiarism cases: Up to 180-day refund period." />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">How to Request a Refund</Typography>
          </Box>
          <Typography>
            You can contact us through the following channels:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email: xyz@contact.com" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone: +1234-3214-6598-985" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Message Board (via your account)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Live Chat (via your account)" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Request-to-Delivery Workflow</Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Order Cancellation" 
                secondary="If you cancel your order, you are entitled to a 100% refund. The funds will be returned to the original payment method within 5-7 business days." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Order Not Downloaded" 
                secondary="If you have not downloaded your order, you can request a full refund within the specified refund period." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Requesting Another Writer" 
                secondary="You may choose a preferred writer for free, but availability is not guaranteed. If an alternate writer is assigned, no refund will be issued." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Late Delivery" 
                secondary="We strive to deliver all orders on time. If an order is delayed, it remains non-refundable. However, we offer compensation in the form of a credit or a special discount for future orders." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="5. Order Canceled by Us" 
                secondary="If we cancel your order halfway or later, you are eligible for a 30% refund or 100% compensation as a Bonus Balance. The funds will be returned within 5-7 business days." 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="6. Quality Claims" 
                secondary="If you believe your order does not meet quality standards, you may request a free revision. For a full refund, documented proof (e.g., instructor feedback, plagiarism report) is required, and the case will be reviewed by our Quality Assurance Department." 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
    <Footer/>
    </>
  );
};

export const TermsAndPrivacy = () => {
  return (
    <>
    <NavBar/>
  
    <Container maxWidth="md" sx={{ my: 4, border: '2px solid #000', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Terms & Conditions and Privacy Policy
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <ReportProblem color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">Disclaimer</Typography>
          </Box>
          <Typography paragraph>
            The materials on the Website are provided ‘as is.’ The Website makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, The Website does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Website or otherwise relating to such materials or on any sites linked to this site. We make no representations that the Website is appropriate or available for all jurisdictions. Those who access or use the Website from other jurisdictions are entirely responsible for compliance with all applicable foreign, United States federal, state, and local laws and regulations.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Gavel color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Copyright</Typography>
          </Box>
          <Typography paragraph>
            The Paper provided to you by the Website remains our property and is subject to copyright and other intellectual property rights under local and international laws and conventions. The Paper is intended for your personal use only provided that: You use the Paper as a guide in the preparation of your own paper; You cite the Website as a source of your paper; You do not submit the Paper as your own work to any educational institution (college, university, school). The Paper may not be used, copied, reproduced, distributed, transmitted, broadcast, displayed, sold, licensed, or otherwise exploited for any other purposes without our prior written consent. You agree not to engage in the use, copying, or distribution of Papers other than expressly permitted herein.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Electronic Communications</Typography>
          </Box>
          <Typography paragraph>
            When you use our Services or send emails, text messages, and other communications from your desktop or mobile device to us, you may be communicating with us electronically. You consent to receive communications from us electronically, such as emails, texts, mobile push notices, or notices and messages on this site or through other services, such as our Message Center. You agree that all agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing. We may contact you using autodialed or prerecorded calls and text messages for account notifications, troubleshooting, dispute resolution, debt collection, surveys, marketing (if consented), and more. You may change your communication preferences at any time. Our communication policies align with our User Privacy Notice. We may share your telephone number with authorized service providers solely for the purposes described above. Conversations with us may be monitored or recorded for quality control, training, or protection purposes. Messages sent through our platform may be analyzed for fraud prevention or policy compliance.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Prohibited Jurisdictions</Typography>
          </Box>
          <Typography paragraph>
            By accessing or using our Website, You represent and warrant that You are not a resident of the following countries: the United Kingdom, Australia, or Austria. Additionally, You may not access our Website if you are a resident of the following U.S. states: California, Colorado, Connecticut, Florida, Illinois, Maine, Maryland, Massachusetts, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, Texas, Virginia, or Washington. If You are found to be accessing the Website from a Prohibited Jurisdiction, Your profile may be deleted, and Services terminated without prior notice.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Testimonials</Typography>
          </Box>
          <Typography paragraph>
            We may post Clients’ testimonials on our Website, including first names or initials. By using this Website, you consent to this usage. If you wish to request removal, please contact contact@skmeducationalmedialtd.com. By submitting testimonials, comments, suggestions, or other content ("Information"), You grant us irrevocable rights to use, modify, and publish the Information without compensation. You must not submit false, misleading, defamatory, obscene, or infringing content.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Notification of Changes</Typography>
          </Box>
          <Typography paragraph>
            We reserve the right to modify these Terms and Conditions at any time. Continued use of the Website signifies acceptance of any updates. Please review regularly.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Governing Law</Typography>
          </Box>
          <Typography paragraph>
            These Terms and Conditions are governed by the laws of Cyprus.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Policy color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Privacy Notice</Typography>
          </Box>
          <Typography paragraph>
            Last Updated: March 2025. SKM Educational Media Ltd respects your privacy and processes personal data securely per applicable legal obligations...
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">What Data We Collect</Typography>
          </Box>
          <List>
            <ListItem>
              <ListItemText primary="Contact details (email, phone number)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Identifying data (IP address, browser type, geolocation, etc.)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Birthday details (for discount offers)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Website usage data (clickstreams, viewed pages, session duration, etc.)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cookie data (session tracking, marketing preferences, and analytics)" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Why We Collect It</Typography>
          </Box>
          <Typography paragraph>
            Service provision, Website improvement, security, customer support, marketing and promotional activities (with consent), and compliance with legal obligations.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Data Retention</Typography>
          </Box>
          <Typography paragraph>
            Personal data is retained only as long as necessary for service provision and legal compliance. Users may request deletion of their data subject to legal limitations.
          </Typography>
        </CardContent>
      </Card>
      
      <Card variant="outlined" sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Info color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Contact Information</Typography>
          </Box>
          <Typography paragraph>
            SKM Educational Media Ltd
          </Typography>
          <Typography paragraph>
            Registered Address: 11-13 Piliou, Quality Towers A, Larnaca, Cyprus
          </Typography>
          <Typography paragraph>
            Email: contact@skmeducationalmedialtd.com
          </Typography>
        </CardContent>
      </Card>
    </Container>
    <Footer/>
    </>
  );
};
