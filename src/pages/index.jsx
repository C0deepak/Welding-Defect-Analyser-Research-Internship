import Head from "next/head";
import axios from "axios";
import { useState } from "react";
import { Image } from "next/image";
function Index() {
	const [errMsg, setErrMsg] = useState("");
	const [img, setImg] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [url, setUrl] = useState();

	const handleSubmit = async (e) => {
		if (!img) {
			setErrMsg("Must Upload Image");
		} else if (!img.type.includes("image")) {
			setErrMsg("Upload image");
			setImg();
		} else {
			try {
				setIsLoading(true);
				const formData = new FormData();
				formData.append("img", img);

				const config = {
					headers: {
						"content-type": "multipart/form-data"
					},
					withCredentials: false
				};
				const res = await axios.post("/api/yolo", formData, config);
				const u = "http://localhost:3000/images/" + res.data.url;
				setUrl(u);
				console.log(url);
				setIsLoading(false);
			} catch (err) {
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
			<div className="eventRegister">
				<div className="heading">Upload Image</div>
				<form encType="multipart/form-data" className="form">
					<div className="file">
						<input
							onChange={(e) => {
								setImg(e.target.files[0]);
								handleSubmit();
							}}
							name="img"
							type="file"
						/>

						<div>
							{url ? "" : <Image alt="Image" width="600px" src={url} />}
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default Index;
