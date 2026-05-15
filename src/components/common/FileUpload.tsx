import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface FileUploadProps {
  onUpload: (data: any[]) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, accept = '.xlsx,.xls,.csv' }) => {
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept,
    showUploadList: true,
    beforeUpload: (file) => {
      // 仅模拟上传，实际读取后调用 onUpload
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // 简化处理：仅做模拟
          message.success(`${file.name} 上传成功，正在解析数据...`);
          onUpload([]);
        } catch {
          message.error('文件解析失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
      return false; // 阻止自动上传
    },
    onDrop() {
      console.log('Dropped files');
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">
        支持 .xlsx、.xls、.csv 格式的持仓数据文件
      </p>
    </Dragger>
  );
};

export default FileUpload;
