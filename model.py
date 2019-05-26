from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from io import BytesIO



import numpy as np
from scipy.io import wavfile
from scipy.signal import decimate
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPool1D, GlobalAvgPool1D, Dropout, BatchNormalization, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, LearningRateScheduler, EarlyStopping
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.regularizers import l2




model = Sequential()
model.add(Conv1D(filters=6, kernel_size=9, activation='relu',
                input_shape = (1551,1),
                kernel_regularizer = l2(0.025)))
model.add(MaxPool1D(strides=4))
model.add(BatchNormalization())
model.add(Conv1D(filters=6, kernel_size=9, activation='relu',
                kernel_regularizer = l2(0.05)))
model.add(MaxPool1D(strides=4))
model.add(BatchNormalization())
model.add(Conv1D(filters=8, kernel_size=9, activation='relu',
                 kernel_regularizer = l2(0.1)))
model.add(MaxPool1D(strides=4))
model.add(BatchNormalization())
model.add(Conv1D(filters=16, kernel_size=9, activation='relu'))
model.add(MaxPool1D(strides=4))
model.add(BatchNormalization())
model.add(Dropout(0.25))
model.add(Conv1D(filters=64, kernel_size=4, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.5))
model.add(Conv1D(filters=32, kernel_size=1, activation='relu'))
model.add(BatchNormalization())
model.add(Dropout(0.7))
model.add(GlobalAvgPool1D())
model.add(Dense(3, activation='softmax'))

model.load_weights("modelWeights.h5");


INPUT_LIB = './input/'
SAMPLE_RATE = 44100
CLASSES = ['artifact', 'normal', 'murmur']
CODE_BOOK = {x:i for i,x in enumerate(CLASSES)}   
NB_CLASSES = len(CLASSES)

def repeat_to_length(arr, length):
    """Repeats the numpy 1D array to given length, and makes datatype float"""
    result = np.empty((length, ), dtype = 'float32')
    l = len(arr)
    pos = 0
    while pos + l <= length:
        result[pos:pos+l] = arr
        pos += l
    if pos < length:
        result[pos:length] = arr[:length-pos]
    return result



def load_wav_file(name, path):
    _, b = wavfile.read(path + name)
    assert _ == SAMPLE_RATE
    return b

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.end_headers()
        response = BytesIO()
        y = body.decode("utf-8")
        j = json.loads(y);
        #fname = j["fname"];
        fdata = load_wav_file(j["fname"],"C:/Users/codet/Desktop/Tiger/Programming/Project/MetroHacks Heart/")
        xdata = repeat_to_length(fdata,396900).reshape(1,396900);
        xdata = decimate(xdata, 8, axis=1, zero_phase=True)
        xdata = decimate(xdata, 8, axis=1, zero_phase=True)
        xdata = decimate(xdata, 4, axis=1, zero_phase=True)
        xdata = xdata / np.std(xdata, axis=1).reshape(-1,1)
        xdata = xdata[:,:,np.newaxis]
        y_hat = model.predict(xdata);
        #y_pred = np.argmax(y_hat, axis=1)
        x = {
            "a": str(y_hat[0][0]),
            "b": str(y_hat[0][1]),
            "c": str(y_hat[0][2])
        }
        response.write(bytes(json.dumps(x),'utf-8'))


        self.wfile.write(response.getvalue())


httpd = HTTPServer(('localhost', 8089), SimpleHTTPRequestHandler)
httpd.serve_forever()