import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
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
});

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
  const cameraTypes = ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Film Camera"];
  const sensorSizes = ["Full Frame", "APS-C", "Micro 4/3", "1-inch", "Other"];
  const useCases = ["Professional", "Amateur", "Beginner", "Specialty"];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
        backgroundColor: '#1a1a1a',
        borderRadius: 2,
      }}
    >
      <StyledTextField
        label="Category Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth
        required
      />

      <StyledFormControl fullWidth required>
        <InputLabel>Camera Type</InputLabel>
        <StyledSelect
          value={cameraType}
          onChange={(e) => setCameraType(e.target.value)}
          label="Camera Type"
        >
          {cameraTypes.map((type) => (
            <StyledMenuItem key={type} value={type}>
              {type}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>

      <StyledFormControl fullWidth required>
        <InputLabel>Sensor Size</InputLabel>
        <StyledSelect
          value={sensorSize}
          onChange={(e) => setSensorSize(e.target.value)}
          label="Sensor Size"
        >
          {sensorSizes.map((size) => (
            <StyledMenuItem key={size} value={size}>
              {size}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>

      <StyledFormControl fullWidth required>
        <InputLabel>Primary Use Case</InputLabel>
        <StyledSelect
          value={primaryUseCase}
          onChange={(e) => setPrimaryUseCase(e.target.value)}
          label="Primary Use Case"
        >
          {useCases.map((useCase) => (
            <StyledMenuItem key={useCase} value={useCase}>
              {useCase}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          {buttonText}
        </Button>
        {handleDelete && (
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ width: '30%' }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CategoryForm;
