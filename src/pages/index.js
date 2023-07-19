import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import { Image } from "next/image";

function Index() {
	const [errMsg, setErrMsg] = useState("");
	const [img, setImg] = useState(null);
	const [img2, setImg2] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!img2) {
			console.log(img2);
			setErrMsg("Must Upload Image");
		} else {
			try {
				setIsLoading(true);
				const formData = new FormData();
				formData.append("file", img2);

				const config = {
					headers: {
						"content-type": "multipart/form-data"
					},
					responseType: "blob",
					withCredentials: false
				};
				const res = await axios.post(
					"http://127.0.0.1:5000/upload",

					formData,
					config
				);
				console.log(res.data);
				const src = URL.createObjectURL(res.data);
				setImg(src);

				console.log(res.data);
				setIsLoading(false);
			} catch (err) {
				console.log(err);
				if (!err?.response) {
					setErrMsg("No Internet connection");
				} else if (err.response?.status === 400) {
					setIsLoading(false);
					setErrMsg(err.response.data.error);
				} else {
					setIsLoading(false);
					setErrMsg("Server Error");
				}
			}
		}
	};

	return (
		<>
			<Head>
				<title>Welding Defect Analyser</title>
			</Head>
			<div className="a">
				<h1>Welding Defect Analyser</h1>
				<div className="heading">Upload Image</div>
				<form encType="multipart/form-data" className="form">
					<div className="file">
						<input
							onChange={(e) => {
								setImg2(e.target.files[0]);
								const reader = new FileReader();
								reader.readAsDataURL(e.target.files[0]);
								reader.onloadend = () => {
									setImg(reader.result);
								};
							}}
							name="img"
							accept="image/*"
							type="file"
						/>
						<button disabled={isLoading} onClick={(e) => handleSubmit(e)}>
							Detect
						</button>
					</div>
				</form>
				{img ? <img height={"500px"} src={img} alt="image" /> : ""}

				{isLoading ? <h3>Loading...</h3> : ""}
				{errMsg ? <h3>{errMsg}</h3> : ""}
			</div>
		</>
	);
}

export default Index;
