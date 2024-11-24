import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select)({
  color: 'white',
  '.MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiPaper-root': {
    backgroundColor: '#1a1a1a',
  },
  '& .MuiMenu-paper': {
    backgroundColor: '#1a1a1a',
  },
  '& .MuiList-root': {
    backgroundColor: '#1a1a1a',
  },
});

const StyledMenuItem = styled(MenuItem)({
  color: 'white',
  backgroundColor: '#1a1a1a',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.24)',
    },
  },
});

const StyledFormControl = styled(FormControl)({
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiSelect-select': {
    backgroundColor: '#0E0E0E',
  },
});

const CategoryForm = ({
  value,
  setValue,
  cameraType,
  setCameraType,
  sensorSize,
  setSensorSize,
  primaryUseCase,
  setPrimaryUseCase,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <Box component="div" sx={{ p: 3, bgcolor: '#0E0E0E', borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Category Name"
          placeholder="Write category name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
          }}
        />

        <StyledFormControl fullWidth>
          <InputLabel>Camera Type</InputLabel>
          <StyledSelect
            value={cameraType}
            label="Camera Type"
            onChange={(e) => setCameraType(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#1a1a1a',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.16)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.24)',
                      },
                    },
                  },
                },
              },
            }}
          >
            <StyledMenuItem value="">Select Camera Type</StyledMenuItem>
            <StyledMenuItem value="DSLR (Digital Single-Lens Reflex) Cameras">DSLR (Digital Single-Lens Reflex) Cameras</StyledMenuItem>
            <StyledMenuItem value="Compact/Point-and-Shoot Cameras">Compact/Point-and-Shoot Cameras</StyledMenuItem>
            <StyledMenuItem value="Action Cameras">Action Cameras</StyledMenuItem>
            <StyledMenuItem value="360-Degree Cameras">360-Degree Cameras</StyledMenuItem>
            <StyledMenuItem value="Instant Cameras">Instant Cameras</StyledMenuItem>
          </StyledSelect>
        </StyledFormControl>

        <StyledFormControl fullWidth>
          <InputLabel>Sensor Size</InputLabel>
          <StyledSelect
            value={sensorSize}
            label="Sensor Size"
            onChange={(e) => setSensorSize(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#1a1a1a',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.16)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.24)',
                      },
                    },
                  },
                },
              },
            }}
          >
            <StyledMenuItem value="">Select Sensor Size</StyledMenuItem>
            <StyledMenuItem value="Full-Frame Cameras">Full-Frame Cameras</StyledMenuItem>
            <StyledMenuItem value="APS-C Cameras">APS-C Cameras</StyledMenuItem>
            <StyledMenuItem value="Micro Four Thirds Cameras">Micro Four Thirds Cameras</StyledMenuItem>
            <StyledMenuItem value="Medium Format Cameras">Medium Format Cameras</StyledMenuItem>
          </StyledSelect>
        </StyledFormControl>

        <StyledFormControl fullWidth>
          <InputLabel>Primary Use Case</InputLabel>
          <StyledSelect
            value={primaryUseCase}
            label="Primary Use Case"
            onChange={(e) => setPrimaryUseCase(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#1a1a1a',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.16)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.24)',
                      },
                    },
                  },
                },
              },
            }}
          >
            <StyledMenuItem value="">Select Primary Use Case</StyledMenuItem>
            <StyledMenuItem value="Photography">Photography</StyledMenuItem>
            <StyledMenuItem value="Videography">Videography</StyledMenuItem>
            <StyledMenuItem value="Vlogging Cameras">Vlogging Cameras</StyledMenuItem>
            <StyledMenuItem value="Professional Cameras">Professional Cameras</StyledMenuItem>
            <StyledMenuItem value="Travel Cameras">Travel Cameras</StyledMenuItem>
          </StyledSelect>
        </StyledFormControl>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {handleDelete && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                bgcolor: '#ef4444',
                '&:hover': {
                  bgcolor: '#dc2626',
                },
              }}
            >
              Delete
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#ec4899',
              '&:hover': {
                bgcolor: '#db2777',
              },
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryForm;
