import ErrorResponse from "../utils/errorResponse.js";

const errorHandle = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;


    if (err.code === 11000) {
        const message = "Duplicate Feild value Entered";
        error = new ErrorResponse(message, err);

    }

    if (err === "ValidationError") {
        
        const message = Object.values(err.errors).map(val => val.message);

        error = new ErrorResponse(message, 400);

    }

    res.status(error.statusCode || 500).json({
        success : false,
        error : error.message || "Server Error"
    })

}

export default errorHandle;