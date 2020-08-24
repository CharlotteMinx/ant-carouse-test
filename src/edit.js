import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, RichText, InspectorControls } from '@wordpress/block-editor';
import { Button, RangeControl, Panel, TextareaControl, RadioControl, ColorPicker, PanelBody, PanelRow, ToggleControl } from '@wordpress/components';
import './editor.scss';


const ALLOWED_MEDIA_TYPES = [ 'image' ]; 

export default function Edit( {className, attributes, setAttributes } ) {
	
	const {points, images, placingPoint, pointFontSize, activeImage, pointColor, placingImage, pointsEnabled, pointSize, numberOfImages} = attributes;
	
	// when user adds image to the carousel
	const onSelectImage = media => {
		if(attributes.images.length == 0) {
			return setAttributes( 
				{
				images: [...attributes.images, {
					mediaURL: media.url,
					mediaID: media.id,
				}],
				activeImage:  media.id,
			});
		}
		return setAttributes( 
			{
			images: [...attributes.images, {
				mediaURL: media.url,
				mediaID: media.id,
			}]
		});
		
	};

	// handles removing images, deletes points for mediaID
	const onRemoveImage = (mediaID,e) => {

		if(mediaID && e) {
		  let res = [...images];
		  let newPoints = [];
		  points.map(p => p.ID != mediaID ? newPoints.push(p) : false);
		  res.splice(res.findIndex(x => x.mediaID == mediaID),1)
		  if(mediaID == activeImage && res.length > 0) {
			  return setAttributes( {
				  images: res,
				  activeImage: res[0].mediaID,
				  points: newPoints
			  } );
		  }
		  return setAttributes( {
			  images: res,
			  points: newPoints
		  } );
	  }
	  }

	  const handleUpdatePointText = (i, value) => {
		let res = [...points];
		res[i].text = value;
		setAttributes({points: res});
	  }

	  const handleChangePointStyle = (i, value) => {
		let res = [...points];
		res[i].style = value;
		setAttributes({points: res});
	  }

	  // when user selects point
	  const setPoint = (e, mediaID) => {
	  	if (e && mediaID && placingPoint) {
	  		const ux = e.clientX;
	  		const uy = e.clientY;
	  		const target = e.target.getBoundingClientRect();

	  		const left = ((ux - target.left) / target.width) * 100;
	  		const top = ((uy - target.top) / target.height) * 100;
	  		return setAttributes({
	  			points: [...attributes.points, {
	  				left: left,
	  				top: top,
					ID: mediaID,
					text: '',  
					style: 'left',
	  			}],
	  			placingPoint: false,
	  		});
	  	}
	  }

	const renderControls = () => {
		return (
			<InspectorControls>
				<PanelBody title={"Core settings"}>
					<PanelRow>
						<RangeControl label={__('Number if images')}
						min={1}
						max={4}
						onChange={(value) => setAttributes({numberOfImages: value})}
						value={numberOfImages}/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
						label={__("Enable point")}
						onChange={value => setAttributes({pointsEnabled: value})}
						checked={pointsEnabled}/>
					</PanelRow>
				</PanelBody>
				{pointsEnabled && <PanelBody title={__("Place a point")}>
					<PanelRow>
						
							<RadioControl
							label={__("setup a point")}
							options={images.map((img, i) => {return {label: 'img ' + i, value: i}})}
							checked={placingImage}
							onChange={(value) => setAttributes({placingImage: value})}/>
	
							<Button onClick={e => enablePlacingPoint(e)}>{__('Place a point')}</Button>
					</PanelRow>
				</PanelBody>}
				{pointsEnabled && <PanelBody title={__("Point settings")}>
					<PanelRow>
						<RangeControl label={__('Size of points')}
							min={1}
							max={40}
							onChange={(value) => setAttributes({pointSize: value})}
							value={pointSize}/>
							
					</PanelRow>
					<PanelRow>
						<RangeControl label={__('Fontsize of point\'s text')}
							min={8}
							max={40}
							onChange={(value) => setAttributes({pointFontSize: value})}
							value={pointFontSize}/>
							
					</PanelRow>
					
					<PanelRow className={"ant-color-picker-wrapper"}>
						<p>{__("Color of points")}</p>
						<ColorPicker
							className={"ant-carousel-settings-color-picker"}
							color={ pointColor }
							onChangeComplete={ ( value ) => setAttributes({pointColor: value.hex})}
							disableAlpha/>
					</PanelRow>

				</PanelBody>}
				{pointsEnabled && <PanelBody  title={__("Manage points")}>
					<PanelRow className={"point__manager--wrapper"}>
						{points.map((point,i) => {
							return(<Panel>
								<div className="point__controls--wrapper">
									<span>{__("point: ")} {i}</span>
									<RadioControl
										options={[{
											label: 'left', value: 'left'},
											{label: 'right', value: 'right'},
											{label: 'bottom', value: 'bottom'},
											{label: 'top', value: 'top'},
										]}
										checked={point.style}
										onChange={(value) => handleChangePointStyle(i, value)}/>
								</div>
								<TextareaControl
									onChange={value => handleUpdatePointText(i,value)}
									value={point.text}
								/>
							</Panel>);
						})}
					</PanelRow>

				</PanelBody>}
			</InspectorControls>);
	}

	// handles ability to place a dot
	var enablePlacingPoint = (e) => {
		if(e) setAttributes({placingPoint: !placingPoint});
	}

	// renders either image with points or placeholder for the possibility of adding more images
	const renderImages = (open) => {
		let res = [];

		for(let i = 0; i < numberOfImages; i++) {
			{/*&& !placingPoint) || placingImage  == i*/}
			if(images[i]?.mediaID ) {
				const img = images[i];
				res.push(<div className={`carousel__image--wrapper`}>
					{/* image element */}
					<div 
					key={img.mediaID}
					className={`image ${placingPoint ? 'placing ' : ''} ${activeImage == img.mediaID ? 'active' : ''}`}
					style={{backgroundImage: `url("${img.mediaURL}")`}}
					onClick={(e) => {setPoint(e, img.mediaID)}}>
						{/* @TODO remove svg */}
						{/* removal button */}
						<img className={'image__placeholder'}src={img.mediaURL}/>
						<span onClick={e => onRemoveImage(img.mediaID,e)}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" role="img" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>
						</span>

						{/* renders points within images */}
						{points.map( (point,i) => {
							
							{if(point.ID == img.mediaID) {
								return (<div className={'point'}
										style={{top: `calc(${point.top}% - ${pointSize/2}px)`, left: `calc(${point.left}% - ${pointSize/2}px)`, width: pointSize + "px", height: pointSize + "px", backgroundColor: pointColor, fontSize: pointSize + 'px', lineHeight: pointSize + 'px'}}>
											+<span className={"number"}>{i}</span>
											{point.text && <div style={{fontSize: pointFontSize}} className={`point__text ${point.style}`}>{point.text}</div>}
										</div>);
							}}
						})}

					</div>
				</div>);
			} else {
				// button to add new image
				// if(!placingPoint) {
					res.push(<div className={`carousel__image--wrapper`}>
								<Button onClick={ open }>{__('Open Media Library')}</Button>
							</div>);
				// }
			}
		}

		// returns the elements
		return res;
	}

	return (
		<div className={ className }>
			{/* renders controls */}
			{renderControls()}
			
			<MediaUploadCheck>

				<MediaUpload
					onSelect={(m) =>onSelectImage(m)}
					allowedTypes={ ALLOWED_MEDIA_TYPES }
					render={ ( { open } ) => (

						<div className={`carousel--wrapper ${images.length < numberOfImages ? 'full' : ''}`}>
								{/* renders images with points or placeholders */}
								{renderImages(open)}
							
						</div>
					) }
				/>
			</MediaUploadCheck>
			
		</div>
	);
}
