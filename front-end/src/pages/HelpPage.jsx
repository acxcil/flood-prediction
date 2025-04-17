import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Divider,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  QuestionAnswer as QuestionIcon,
  Help as HelpIcon,
  MenuBook as GuideIcon,
  ContactSupport as ContactIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAlert } from '../contexts/AlertContext';

/**
 * Help and documentation page
 */
const HelpPage = () => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // FAQ data
  const faqItems = [
    {
      question: "What is the Flood Prediction System?",
      answer: "The Flood Prediction System is a machine learning-based application that predicts flood risks in various regions based on environmental and hydrological data such as rainfall, river levels, and soil moisture."
    },
    {
      question: "How accurate are the flood predictions?",
      answer: "Our model has been trained on historical data and achieves approximately 85% accuracy in predicting flood events. However, predictions should be considered as risk assessments rather than definitive forecasts, and standard emergency protocols should always be followed."
    },
    {
      question: "How is the risk level determined?",
      answer: "Risk levels (Low, Medium, High) are determined based on the probability of flooding. Probabilities above 70% are classified as High risk, between 40-70% as Medium risk, and below 40% as Low risk."
    },
    {
      question: "Can I receive alerts for specific regions?",
      answer: "Yes, by creating an account and setting up your profile preferences, you can subscribe to alerts for specific regions. You'll receive notifications when the flood risk exceeds your specified threshold."
    },
    {
      question: "How often is the data updated?",
      answer: "The system updates data every 3 hours with the latest environmental and hydrological measurements. Historical data is stored for analysis and model improvement."
    },
    {
      question: "Can I download historical data for my own analysis?",
      answer: "Yes, you can export historical data in CSV or JSON format from the Historical Data page. You can filter by region and date range before exporting."
    },
    {
      question: "What should I do if I notice a high flood risk prediction?",
      answer: "High flood risk predictions should be taken seriously. Monitor local weather reports and official government alerts, and be prepared to follow evacuation procedures if instructed by local authorities."
    }
  ];
  
  // Filter FAQ items based on search query
  const filteredFAQs = faqItems.filter(item => 
    searchQuery === '' || 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle contact form input change
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to a backend API
    console.log('Contact form submitted:', contactForm);
    showAlert('Your message has been sent. We will get back to you soon.', 'success');
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Help & Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Learn how to use the Flood Prediction System and find answers to common questions
        </Typography>
      </Box>
      
      {/* Search */}
      <Paper sx={{ p: 2, mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Search documentation and FAQs..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
        />
      </Paper>
      
      {/* Quick Links */}
      <Typography variant="h5" gutterBottom>
        Quick Help
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <QuestionIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                FAQ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find answers to frequently asked questions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <GuideIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                User Guide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed instructions on using the system
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            component={Link}
            to="/prediction"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <HelpIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Make a Prediction
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Learn how to create flood predictions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <ContactIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Contact Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get in touch with our support team
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* FAQ Section */}
      <Typography variant="h5" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Paper sx={{ mb: 4 }}>
        {filteredFAQs.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No results found for "{searchQuery}"
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search term or browse the categories below
            </Typography>
          </Box>
        ) : (
          filteredFAQs.map((faq, index) => (
            <Accordion key={index} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-content-${index}`}
                id={`faq-header-${index}`}
              >
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>
      
      {/* Contact Form */}
      <Typography variant="h5" gutterBottom>
        Contact Support
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Send us a message
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill out the form below and our support team will get back to you as soon as possible.
            </Typography>
            
            <form onSubmit={handleContactSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Other ways to get help
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Technical Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                For technical issues or questions about the system's functionality:
                Email: support@floodprediction.example.com
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Emergency Assistance
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                For emergency situations, please contact your local emergency services at 911 or your regional disaster management authority.
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Documentation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View our complete documentation for detailed instructions on using all features of the Flood Prediction System.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default HelpPage;