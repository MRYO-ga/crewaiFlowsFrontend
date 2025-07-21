import React from 'react';
import AIBuilder from '../../components/AIBuilder';
import productConfig from '../../configs/productConfig';
import { productService } from '../../services/productApi';

const ProductPage = () => {
  return (
    <div className="w-full h-full">
      <AIBuilder
        config={productConfig}
        service={productService}
        onSave={(savedDocument) => {
          console.log('产品文档已保存:', savedDocument);
        }}
      />
    </div>
  );
};

export default ProductPage;