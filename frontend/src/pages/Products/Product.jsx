import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          className="product-image"
          image={product.image}
          alt={product.name}
        />
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <HeartIcon product={product} />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center'
          }}>
            <Typography variant="h6" component="div" sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {product.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                bgcolor: 'pink.100',
                color: 'pink.800',
                px: 1.5,
                py: 0.5,
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              $ {product.price}
            </Typography>
          </Box>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Product;
